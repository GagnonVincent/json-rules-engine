'use strict'

import Condition from './condition'
import Rule from './rule'
import Engine from './engine'
import debug from './debug'

/**
 * Rule engine running on an array of elements.
 */
class FilterEngine {
  /**
   * Returns a new FilterEngine instance.
   * @param  {Condition[] | string} conditions - Array of conditions or json string that can be parsed into array of condition to initialize with.
   * Multiple conditions behave as a AND.
   */
  constructor (conditions = []) {
    if (typeof conditions === 'string') {
      conditions = JSON.parse(conditions)
    }

    this.conditions = []
    conditions.map(c => this.addCondition(c))
  }

  /**
   * Add a condition definition to the FilterEngine.
   * @param {object|Condition} condition - Condition definition. Can be JSON representation, or instance of Condition.
   */
  addCondition (condition) {
    if (!condition) throw new Error('FilterEngine: addCondition() requires condition')

    let newCondition
    if (condition instanceof Condition) {
      newCondition = condition
    } else {
      newCondition = new Condition(condition)
    }

    this.conditions.push(newCondition)
    return this
  }

  /**
   * Remove a condition from the FilterEngine.
   * @param {object|Condition} condition - Condition definition. Must be a instance of Condition.
   */
  removeCondition (condition) {
    let conditionRemoved = false
    if (!(condition instanceof Condition)) {
      // If the other condition is not an instance of Condition, we compare the JSON representation
      // of the objects. Must have the exact same properties / values.
      let otherCondition

      try {
        otherCondition = new Condition(condition).toJSON()
      } catch (error) {
        return false
      }
      const filteredConditions = this.conditions.filter(conditionInEngine => conditionInEngine.toJSON() !== otherCondition)
      conditionRemoved = filteredConditions.length !== this.conditions.length
      this.conditions = filteredConditions
    } else {
      const index = this.conditions.indexOf(condition)
      if (index > -1) {
        conditionRemoved = Boolean(this.conditions.splice(index, 1).length)
      }
    }
    return conditionRemoved
  }

  /**
   * Runs the rules filter engine.
   * @param  {Object} factsArray - Array of facts to filter.
   * @return {Promise} Resolves when the engine has completed running. Returns the facts meeting the conditions.
   */
  run (factsArray = []) {
    debug('filter-engine::run started')

    // Each condition becomes a rule.
    const rules = this.conditions.map(c => {
      return new Rule({
        conditions: c,
        event: {
          type: 'filter-passed'
        }
      })
    })

    // Build the rule engine with the rules created with the conditions.
    const engine = new Engine(rules, { allowUndefinedFacts: true })

    // Run the engine in parallel for all facts.
    const enginePromises = factsArray.map(fact => {
      return engine.run(fact)
        .then(({ failureResults }) => {
          return {
            fact,
            qualify: !failureResults.length
          }
        })
    })

    // Return all elements meeting the conditions.
    return Promise.all(enginePromises)
      .then((e) =>
        e.filter((e) => e.qualify)
          .map((e) => e.fact))
  }
}

export default FilterEngine
