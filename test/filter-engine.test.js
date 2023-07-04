'use strict'

import Condition from '../src/condition'
import { FilterEngine } from '../src/index'

describe('Filter-Engine', () => {
  let filterEngine

  beforeEach(() => {
    filterEngine = new FilterEngine()
  })

  it('has methods for managing conditions and running itself', () => {
    expect(filterEngine).to.have.property('addCondition')
    expect(filterEngine).to.have.property('removeCondition')
    expect(filterEngine).to.have.property('run')
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
        value: 50,
        name: 'ageIs50'
      }))
      const condition2 = new Condition(factories.condition({
        fact: 'height',
        value: 6,
        name: 'heightIs6'
      }))

      filterEngine.addCondition(condition1)
      filterEngine.addCondition(condition2)

      return [condition1, condition2]
    }
    context('remove by name', () => {
      it('removes a single condition', () => {
        const [condition1] = setup()

        expect(filterEngine.conditions.length).to.equal(2)
        const isRemoved = filterEngine.removeCondition(condition1.name)

        expect(isRemoved).to.be.true()
        expect(filterEngine.conditions.length).to.equal(1)
      })

      it('removes many conditions with same name', () => {
        const [condition1] = setup()

        filterEngine.addCondition(condition1)
        expect(filterEngine.conditions.length).to.equal(3)

        const isRemoved = filterEngine.removeCondition(condition1.name)

        expect(isRemoved).to.be.true()
        expect(filterEngine.conditions.length).to.equal(1)
      })

      it('returns false when condition cannot be found', () => {
        setup()
        expect(filterEngine.conditions.length).to.equal(2)

        const isRemoved = filterEngine.removeCondition('amountIsOver5')

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
