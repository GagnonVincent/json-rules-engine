'use strict'
/*
 * This is a basic example demonstrating how to use the filter-engine module to filter arrays elements using the rules engine.
 *
 * Usage:
 *   npm run build
 *   node ./examples/10-filtering-array.js
 *
 * For detailed output:
 *   DEBUG=json-rules-engine node ./examples/10-filtering-array.js
 */
require('colors')

// The filter-engine is not yet in the package so we need to use the project reference
const { FilterEngine } = require('../dist/json-rules-engine')

async function start () {
  /**
   * Setup a new filter engine
   */
  const filterEngine = new FilterEngine()

  // Conditions for determining honor role student athletes (student has GPA >= 3.5 AND is an athlete)
  filterEngine.addCondition({
    all: [{
      fact: 'athlete',
      operator: 'equal',
      value: true
    }, {
      fact: 'GPA',
      operator: 'greaterThanInclusive',
      value: 3.5
    }]
  })

  const facts = [
    { athlete: false, GPA: 3.9, username: 'joe' },
    { athlete: true, GPA: 3.5, username: 'larry' },
    { athlete: false, GPA: 3.1, username: 'jane' },
    { athlete: true, GPA: 4.0, username: 'janet' },
    { athlete: true, GPA: 1.1, username: 'sarah' }
  ]

  // Filters the array with the conditions
  const results = await filterEngine.run(facts)

  // Show succeeded
  results.forEach(athlete => console.log(`${athlete.username} meets all the conditions.`.green))

  // Show failed
  facts.forEach(athlete => {
    if (results.filter(result => result.username === athlete.username).length === 0) {
      console.log(`${athlete.username} doesn't meet all the conditions.`.red)
    }
  })
}
start()
/*
 * OUTPUT:
 *
 * larry meets all the conditions.
 * janet meets all the conditions.
 * joe doesn't meet all the conditions.
 * jane doesn't meet all the conditions.
 * sarah doesn't meet all the conditions.
 */
