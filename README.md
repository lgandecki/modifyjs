# modifyjs
![Circle CI](https://circleci.com/gh/lgandecki/modifyjs.svg?style=shield)

Modify your objects with a mongo like syntax. This is mostly forked code of a modify function of Meteor's brilliant minimongo package, changed to work without Meteor context, and included nice, readable tests based on a mongodb documentation.

### Usage
The usage is shown in the [src/modify.test.js](src/modify.test.js) file, but to show a simple example:

```javascript
import modify from 'modifyjs';
  
const myObject = { _id: 1, scores: [ 0, 2, 5, 5, 1, 0 ] };

const updatedObject = modify(myObject, {$pullAll: {scores: [0, 5]}});

const expectedObject = {_id: 1, scores: [2, 1]};
expect(updatedObject).toEqual(expectedObject);
```

### Installation
```
npm install modifyjs
```

### Implemented:
```
    $min
      ✓ updates a field when the passed value is lower than an existing one (3ms)
      ✓ doesn't update a field when the passed value is higher than an existing one
    $max
      ✓ updates a field when the passed value is higher than an existing one
      ✓ doesn't update a field when the passed value is lower than an existing one (1ms)
    $inc
      ✓ can increment with positive and negative values at the same time
    $set
      ✓ sets top-level fields (1ms)
      ✓ sets fields in embedded documents (1ms)
      ✓ sets elements in arrays
    $unset
      ✓ deletes a particular field (1ms)
    $push
      ✓ appends a value to an array
      ✓ appends multiple values to an array (1ms)
    $pushAll
      ✓ appends multiple values to an array without $each
    $addToSet
      ✓ appends array with an array
      ✓ adds element to an array if element doesn't already exist (1ms)
      ✓ doesn't add an element to the array if it does already exists
      ✓ adds multiple values to the array field with $each modifier, omitting existing ones
    $pop
      ✓ removes the first element from an array (1ms)
      ✓ removes the last item of an array
    $pullAll
      ✓ removes all instances of the specified values from an existing array (1ms)
    $rename
      ✓ updates the name of a field
```

### Not implemented yet:
```
    $currentDate
    $pull (but $pullAll works)
    $push with $sort modifier
``` 
