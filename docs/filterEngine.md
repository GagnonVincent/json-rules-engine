# Filter-Engine

The Filter-Engine filters an array of items meeting all the [Conditions](./rules.md#conditions) specified in the engine.
An instance of [Engine](./engine.md) is used underneath and run all the conditions as separated rules.

* [Methods](#methods)
    * [constructor([Array conditions | String json])](#constructorarray-conditions--string-json)
    * [engine.addCondition(Condition instance | Object options)](#filterengineaddconditioncondition-instance--object-options)
    * [engine.removeCondition(Condition instance | Object options)](#filterengineremoveconditioncondition-instance--object-options---boolean)
    * [engine.run(Objects []) -&gt; Promise (Objects [])](#filterenginerunobjects----promiseobjects-)

## Methods

### constructor([Array conditions | String json])

```js
let FilterEngine = require('json-rules-engine').FilterEngine

// initialize with no condition
let filterEngine = new FilterEngine()

// initialize with conditions
let filterEngine = new FilterEngine([Array conditions])
```

### filterEngine.addCondition(Condition instance | Object options)

Adds a condition to the filter engine. The filter engine will take account the condition upon the next ```run()```
```js
let Condition = require('json-rules-engine').Condition

// via condition properties:
filterEngine.addCondition({
  all: [
    {
      fact: 'my-fact',
      operator: 'lessThanInclusive',
      value: 1
    }
  ]
})

// or condition instance:
let condition = new Condition()
filterEngine.addCondition(condition)
```
Link to the [Conditions documentation](./rules.md#conditions)


### filterEngine.removeCondition(Condition instance | Object options) -> Boolean

Removes a condition from the filter engine, either by passing a condition instance or an options object. When removing by options object, all conditions having the exact same properties / values will be removed.

Method returns true when condition was successfully remove, or false when not found.

```javascript
// adds a condition
let condition = new Condition({
    any: [{
      fact: 'age',
      operator: 'lessThan',
      value: 21
    }]
  })

engine.addCondition(condition)

//remove it by instance
engine.removeCondition(condition)
//or by options
engine.removeCondition({
    any: [{
      fact: 'age',
      operator: 'lessThan',
      value: 21
    }]
  })
```

### filterEngine.run(Objects []) -> Promise(Objects [])

Runs the engine to filter elements of an array. Returns a promise which returns all elements contain in the array meeting all the conditions.

```js

const facts = [
  {
    foo: 1
  },
  {
    foo: 2
  }  
]

// run the filter engine
const results = await engine.run(facts)
```
Link to the [Conditions documentation](./rules.md#conditions)