import {default as libIsArray} from './lib/isArray';
import each from './lib/each';
import isBinary from './lib/isBinary'
import isPlainObject from './lib/isPlainObject'

const _ = {isArray: libIsArray, each};
// Like _.isArray, but doesn't regard polyfilled Uint8Arrays on old browsers as
// arrays.
// XXX maybe this should be EJSON.isArray
export const isArray = function (x) {
  return _.isArray(x) && !isBinary(x);
};


export const isIndexable = function (x) {
    return isArray(x) || isPlainObject(x);
};

// Returns true if this is an object with at least one key and all keys begin
// with $.  Unless inconsistentOK is set, throws if some keys begin with $ and
// others don't.
export const isOperatorObject = function (valueSelector, inconsistentOK) {
  if (!isPlainObject(valueSelector))
    return false;

  var theseAreOperators = undefined;
  _.each(valueSelector, function (value, selKey) {
    var thisIsOperator = selKey.substr(0, 1) === '$';
    if (theseAreOperators === undefined) {
      theseAreOperators = thisIsOperator;
    } else if (theseAreOperators !== thisIsOperator) {
      if (!inconsistentOK)
        throw new Error("Inconsistent operator: " +
          JSON.stringify(valueSelector));
      theseAreOperators = false;
    }
  });
  return !!theseAreOperators;  // {} has no operators
};

// string can be converted to integer
export const isNumericKey = function (s) {
    return /^[0-9]+$/.test(s);
};