'use strict'

import Condition from '../src/condition'
import { FilterEngine } from '../src/index'

describe('Filter-Engine', () => {
  let filterEngine

  beforeEach(() => {
    filterEngine = new FilterEngine()
  })
  describe('constructor', () => {
    it('initializes with no condition', () => {
      expect(filterEngine.conditions.length).to.equal(0)
    })
    it('initializes with condition instances', () => {
      const condition1 = new Condition(factories.condition({
        fact: 'age',
        value: 50
      }))
      const condition2 = new Condition(factories.condition({
        fact: 'height',
        value: 6
      }))

      filterEngine = new FilterEngine([condition1, condition2])

      expect(filterEngine.conditions.length).to.equal(2)
    })
    it('initializes with json string', () => {
      const condition1 = factories.condition({
        fact: 'age',
        value: 50
      })
      const condition2 = factories.condition({
        fact: 'height',
        value: 6
      })

      const json = JSON.stringify([condition1, condition2])
      filterEngine = new FilterEngine(json)

      expect(filterEngine.conditions.length).to.equal(2)
    })
  })

  describe('addCondition()', () => {
    describe('condition instance', () => {
      it('adds the condition', () => {
        const condition = new Condition(factories.condition({
          fact: 'height'
        }))
        expect(filterEngine.conditions.length).to.equal(0)
        filterEngine.addCondition(condition)
        expect(filterEngine.conditions.length).to.equal(1)
      })
    })
    describe('anonymous object', () => {
      it('adds the condition', () => {
        const condition = factories.condition({
          fact: 'height'
        })
        expect(filterEngine.conditions.length).to.equal(0)
        filterEngine.addCondition(condition)
        expect(filterEngine.conditions.length).to.equal(1)
      })
      it('condition is required', () => {
        const condition = null
        expect(() => {
          filterEngine.addCondition(condition)
        }).to.throw(/FilterEngine: addCondition\(\) requires condition/)
      })
    })
  })

  describe('removeCondition()', () => {
    function setup () {
      const condition1 = new Condition(factories.condition({
        fact: 'age',
        value: 50
      }))
      const condition2 = new Condition(factories.condition({
        fact: 'height',
        value: 6
      }))

      filterEngine.addCondition(condition1)
      filterEngine.addCondition(condition2)

      return [condition1, condition2]
    }
    context('remove by anonymous object', () => {
      it('removes a single condition', () => {
        setup()
        const condition1 = factories.condition({
          fact: 'height',
          value: 6
        })

        expect(filterEngine.conditions.length).to.equal(2)

        const isRemoved = filterEngine.removeCondition(condition1)

        expect(isRemoved).to.be.true()
        expect(filterEngine.conditions.length).to.equal(1)
      })

      it('removes many conditions with exact same properties', () => {
        const [condition1] = setup()
        const conditionToDelete = factories.condition({
          fact: 'age',
          value: 50
        })

        filterEngine.addCondition(condition1)
        expect(filterEngine.conditions.length).to.equal(3)

        const isRemoved = filterEngine.removeCondition(conditionToDelete)

        expect(isRemoved).to.be.true()
        expect(filterEngine.conditions.length).to.equal(1)
      })

      it('returns false when condition cannot be found', () => {
        setup()
        expect(filterEngine.conditions.length).to.equal(2)

        const condition3 = factories.condition({
          fact: 'min-age',
          value: 51
        })

        const isRemoved = filterEngine.removeCondition(condition3)

        expect(isRemoved).to.be.false()
        expect(filterEngine.conditions.length).to.equal(2)
      })

      it('returns false when object is not a condition', () => {
        setup()
        expect(filterEngine.conditions.length).to.equal(2)

        const condition3 = {
          age: 32
        }

        const isRemoved = filterEngine.removeCondition(condition3)

        expect(isRemoved).to.be.false()
        expect(filterEngine.conditions.length).to.equal(2)
      })
    })
    context('remove by condition object', () => {
      it('removes a single condition', () => {
        const [condition1] = setup()
        expect(filterEngine.conditions.length).to.equal(2)

        const isRemoved = filterEngine.removeCondition(condition1)

        expect(isRemoved).to.be.true()
        expect(filterEngine.conditions.length).to.equal(1)
      })

      it('returns false when condition cannot be found', () => {
        setup()
        expect(filterEngine.conditions.length).to.equal(2)

        const condition3 = new Condition(factories.condition({
          fact: 'age',
          value: 50
        }))

        const isRemoved = filterEngine.removeCondition(condition3)

        expect(isRemoved).to.be.false()
        expect(filterEngine.conditions.length).to.equal(2)
      })
    })
  })
})
