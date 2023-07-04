# Filter-Engine

The Filter-Engine filters an array of items meeting all the [Conditions](./rules.md#conditions) specified in the engine.
An instance of [Engine](./engine.md) is used underneath and run all the conditions as separated rules.

* [Methods](#methods)
    * [constructor([Array conditions | String json])](#constructorarray-conditions--string-json)
    * [filterEngine.addCondition(Condition instance | Object options)](#filterengineaddconditioncondition-instance--object-options)
    * [filterEngine.removeCondition(Condition instance | Object | String)](#filterengineremoveconditioncondition-instance--object--string---boolean)
    * [filterEngine.run(Objects []) -&gt; Promise (Objects [])](#filterenginerunobjects----promiseobjects-)

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
  ],
  name: 'ageIsLessOrEqualsTo21'
})

// or condition instance:
let condition = new Condition()
filterEngine.addCondition(condition)
```
Link to the [Conditions documentation](./rules.md#conditions)


### filterEngine.removeCondition(Condition instance | Object | String) -> Boolean

Removes a condition from the filter engine, either by passing a condition instance or an object / string witch represant the name of the condition. When removing by name, all conditions having the exact same name will be removed.

Method returns true when condition was successfully remove, or false when not found.

```javascript
// adds a condition
let condition = new Condition({
    any: [{
      fact: 'age',
      operator: 'lessThan',
      value: 21
    }],
    name: 'ageIsLessThan21'
  })

filterEngine.addCondition(condition)

//remove it by instance
filterEngine.removeCondition(condition)
//or by name
filterEngine.removeCondition('ageIsLessThan21')
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
const results = await filterEngine.run(facts)
```
Link to the [Conditions documentation](./rules.md#conditions)