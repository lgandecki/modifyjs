import {default as underscoreIsArray} from 'lodash-es/isArray';
import each from 'lodash-es/each';
import {_f} from './selector';
import EJSON from './ejson';

const _ = {isArray: underscoreIsArray, each};
// Like _.isArray, but doesn't regard polyfilled Uint8Arrays on old browsers as
// arrays.
// XXX maybe this should be EJSON.isArray
export const isArray = function (x) {
  return _.isArray(x) && !EJSON.isBinary(x);
};

// XXX maybe this should be EJSON.isObject, though EJSON doesn't know about
// RegExp
// XXX note that _type(undefined) === 3!!!!
export const isPlainObject = function (x) {
  return x && _f._type(x) === 3;
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