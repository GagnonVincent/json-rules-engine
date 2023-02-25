'use strict'

import { FilterEngine } from '../src/index'

describe('Filter-Engine: run', () => {
  let filterEngine

  const facts = [{
    name: 'John',
    age: 86
  },
  {
    name: 'Bob',
    age: 80
  }]

  const conditionLess21 = {
    any: [{
      fact: 'age',
      operator: 'lessThan',
      value: 21
    }]
  }

  const conditionGreater21 = {
    any: [{
      fact: 'age',
      operator: 'greaterThanInclusive',
      value: 21
    }]
  }

  const conditionGreater75 = {
    any: [{
      fact: 'age',
      operator: 'greaterThanInclusive',
      value: 75
    }]
  }

  beforeEach(() => {
    filterEngine = new FilterEngine([conditionGreater21])
  })

  describe('facts array not empty', () => {
    it('with one condition, returns array elements', () => {
      return filterEngine.run(facts).then(results => {
        expect(results.length).to.equal(facts.length)
      })
    })

    it('with multiple conditions, returns array elements', () => {
      filterEngine.addCondition(conditionGreater75)

      return filterEngine.run(facts).then(results => {
        expect(results.length).to.equal(facts.length)
      })
    })

    it('with oposite conditions, returns empty array', () => {
      filterEngine.addCondition(conditionGreater75)
      filterEngine.addCondition(conditionLess21)

      return filterEngine.run(facts).then(results => {
        expect(results).to.be.empty()
      })
    })

    it('with no condition, returns array elements', () => {
      filterEngine = new FilterEngine()

      return filterEngine.run(facts).then(results => {
        expect(results.length).to.equal(facts.length)
      })
    })
  })

  describe('facts array empty', () => {
    it('with one condition, returns empty array', () => {
      return filterEngine.run([]).then(results => {
        expect(results).to.be.empty()
      })
    })
  })

  describe('facts missing condition property', () => {
    it('with one condition, returns empty array', () => {
      return filterEngine.run([{ level: 1 }]).then(results => {
        expect(results).to.be.empty()
      })
    })
  })
})
