'use strict';

var underscore = require('underscore');

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

MinimongoError = function MinimongoError(message) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof message === "string" && options.field) {
    message += " for field '" + options.field + "'";
  }

  var e = new Error(message);
  e.name = "MinimongoError";
  return e;
};

var MinimongoError$1 = MinimongoError;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

// Make sure field names do not contain Mongo restricted
// characters ('.', '$', '\0').
// https://docs.mongodb.com/manual/reference/limits/#Restrictions-on-Field-Names
var invalidCharMsg = {
  '.': "contain '.'",
  '$': "start with '$'",
  '\0': "contain null bytes"
};
function assertIsValidFieldName(key) {
  var match = void 0;
  if (underscore.isString(key) && (match = key.match(/^\$|\.|\0/))) {
    throw MinimongoError$1('Key ' + key + ' must not ' + invalidCharMsg[match[0]]);
  }
}

// checks if all field names in an object are valid
function assertHasValidFieldNames(doc) {
  if (doc && (typeof doc === 'undefined' ? 'undefined' : _typeof(doc)) === "object") {
    JSON.stringify(doc, function (key, value) {
      assertIsValidFieldName(key);
      return value;
    });
  }
}

EJSON = {};
EJSONTest = {};

// Add a custom type, using a method of your choice to get to and
// from a basic JSON-able representation.  The factory argument
// is a function of JSON-able --> your object
// The type you add must have:
// - A toJSONValue() method, so that Meteor can serialize it
// - a typeName() method, to show how to look it up in our type table.
// It is okay if these methods are monkey-patched on.
// EJSON.clone will use toJSONValue and the given factory to produce
// a clone, but you may specify a method clone() that will be
// used instead.
// Similarly, EJSON.equals will use toJSONValue to make comparisons,
// but you may provide a method equals() instead.
/**
 * @summary Add a custom datatype to EJSON.
 * @locus Anywhere
 * @param {String} name A tag for your custom type; must be unique among custom data types defined in your project, and must match the result of your type's `typeName` method.
 * @param {Function} factory A function that deserializes a JSON-compatible value into an instance of your type.  This should match the serialization performed by your type's `toJSONValue` method.
 */

var _$2 = { has: underscore.has, isNaN: underscore.isNaN, size: underscore.size, isEmpty: underscore.isEmpty, any: underscore.any, each: underscore.each, all: underscore.all, isArguments: underscore.isArguments, isArray: underscore.isArray };

EJSON.isBinary = function (obj) {
  return !!(typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array || obj && obj.$Uint8ArrayPolyfill);
};

/**
 * @summary Return true if `a` and `b` are equal to each other.  Return false otherwise.  Uses the `equals` method on `a` if present, otherwise performs a deep comparison.
 * @locus Anywhere
 * @param {EJSON} a
 * @param {EJSON} b
 * @param {Object} [options]
 * @param {Boolean} options.keyOrderSensitive Compare in key sensitive order, if supported by the JavaScript implementation.  For example, `{a: 1, b: 2}` is equal to `{b: 2, a: 1}` only when `keyOrderSensitive` is `false`.  The default is `false`.
 */
EJSON.equals = function (a, b, options) {
  var i;
  var keyOrderSensitive = !!(options && options.keyOrderSensitive);
  if (a === b) return true;
  if (_$2.isNaN(a) && _$2.isNaN(b)) return true; // This differs from the IEEE spec for NaN equality, b/c we don't want
  // anything ever with a NaN to be poisoned from becoming equal to anything.
  if (!a || !b) // if either one is falsy, they'd have to be === to be equal
    return false;
  if (!((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object')) return false;
  if (a instanceof Date && b instanceof Date) return a.valueOf() === b.valueOf();
  if (EJSON.isBinary(a) && EJSON.isBinary(b)) {
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  if (typeof a.equals === 'function') return a.equals(b, options);
  if (typeof b.equals === 'function') return b.equals(a, options);
  if (a instanceof Array) {
    if (!(b instanceof Array)) return false;
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (!EJSON.equals(a[i], b[i], options)) return false;
    }
    return true;
  }

  // fall back to structural equality of objects
  var ret;
  if (keyOrderSensitive) {
    var bKeys = [];
    _$2.each(b, function (val, x) {
      bKeys.push(x);
    });
    i = 0;
    ret = _$2.all(a, function (val, x) {
      if (i >= bKeys.length) {
        return false;
      }
      if (x !== bKeys[i]) {
        return false;
      }
      if (!EJSON.equals(val, b[bKeys[i]], options)) {
        return false;
      }
      i++;
      return true;
    });
    return ret && i === bKeys.length;
  } else {
    i = 0;
    ret = _$2.all(a, function (val, key) {
      if (!_$2.has(b, key)) {
        return false;
      }
      if (!EJSON.equals(val, b[key], options)) {
        return false;
      }
      i++;
      return true;
    });
    return ret && _$2.size(b) === i;
  }
};

/**
 * @summary Return a deep copy of `val`.
 * @locus Anywhere
 * @param {EJSON} val A value to copy.
 */
EJSON.clone = function (v) {
  var ret;
  if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) !== "object") return v;
  if (v === null) return null; // null has typeof "object"
  if (v instanceof Date) return new Date(v.getTime());
  // RegExps are not really EJSON elements (eg we don't define a serialization
  // for them), but they're immutable anyway, so we can support them in clone.
  if (v instanceof RegExp) return v;
  if (EJSON.isBinary(v)) {
    ret = EJSON.newBinary(v.length);
    for (var i = 0; i < v.length; i++) {
      ret[i] = v[i];
    }
    return ret;
  }
  // XXX: Use something better than underscore's isArray
  if (_$2.isArray(v) || _$2.isArguments(v)) {
    // For some reason, _.map doesn't work in this context on Opera (weird test
    // failures).
    ret = [];
    for (i = 0; i < v.length; i++) {
      ret[i] = EJSON.clone(v[i]);
    }return ret;
  }
  // handle general user-defined typed Objects if they have a clone method
  if (typeof v.clone === 'function') {
    return v.clone();
  }

  // handle other objects
  ret = {};
  _$2.each(v, function (value, key) {
    ret[key] = EJSON.clone(value);
  });
  return ret;
};

var _f = {
  // XXX for _all and _in, consider building 'inquery' at compile time..

  _type: function _type(v) {
    if (typeof v === "number") return 1;
    if (typeof v === "string") return 2;
    if (typeof v === "boolean") return 8;
    if (isArray(v)) return 4;
    if (v === null) return 10;
    if (v instanceof RegExp)
      // note that typeof(/x/) === "object"
      return 11;
    if (typeof v === "function") return 13;
    if (v instanceof Date) return 9;
    if (EJSON.isBinary(v)) return 5;
    return 3; // object

    // XXX support some/all of these:
    // 14, symbol
    // 15, javascript code with scope
    // 16, 18: 32-bit/64-bit integer
    // 17, timestamp
    // 255, minkey
    // 127, maxkey
  },

  // deep equality test: use for literal document and array matches
  _equal: function _equal(a, b) {
    return EJSON.equals(a, b, { keyOrderSensitive: true });
  },

  // maps a type code to a value that can be used to sort values of
  // different types
  _typeorder: function _typeorder(t) {
    // http://www.mongodb.org/display/DOCS/What+is+the+Compare+Order+for+BSON+Types
    // XXX what is the correct sort position for Javascript code?
    // ('100' in the matrix below)
    // XXX minkey/maxkey
    return [-1, // (not a type)
    1, // number
    2, // string
    3, // object
    4, // array
    5, // binary
    -1, // deprecated
    6, // ObjectID
    7, // bool
    8, // Date
    0, // null
    9, // RegExp
    -1, // deprecated
    100, // JS code
    2, // deprecated (symbol)
    100, // JS code
    1, // 32-bit int
    8, // Mongo timestamp
    1 // 64-bit int
    ][t];
  },

  // compare two values of unknown type according to BSON ordering
  // semantics. (as an extension, consider 'undefined' to be less than
  // any other value.) return negative if a is less, positive if b is
  // less, or 0 if equal
  _cmp: function _cmp(a, b) {
    if (a === undefined) return b === undefined ? 0 : -1;
    if (b === undefined) return 1;
    var ta = this._type(a);
    var tb = this._type(b);
    var oa = this._typeorder(ta);
    var ob = this._typeorder(tb);
    if (oa !== ob) return oa < ob ? -1 : 1;
    if (ta !== tb)
      // XXX need to implement this if we implement Symbol or integers, or
      // Timestamp
      throw Error("Missing type coercion logic in _cmp");
    if (ta === 7) {
      // ObjectID
      // Convert to string.
      ta = tb = 2;
      a = a.toHexString();
      b = b.toHexString();
    }
    if (ta === 9) {
      // Date
      // Convert to millis.
      ta = tb = 1;
      a = a.getTime();
      b = b.getTime();
    }

    if (ta === 1) // double
      return a - b;
    if (tb === 2) // string
      return a < b ? -1 : a === b ? 0 : 1;
    if (ta === 3) {
      // Object
      // this could be much more efficient in the expected case ...
      var to_array = function to_array(obj) {
        var ret = [];
        for (var key in obj) {
          ret.push(key);
          ret.push(obj[key]);
        }
        return ret;
      };
      return this._cmp(to_array(a), to_array(b));
    }
    if (ta === 4) {
      // Array
      for (var i = 0;; i++) {
        if (i === a.length) return i === b.length ? 0 : -1;
        if (i === b.length) return 1;
        var s = this._cmp(a[i], b[i]);
        if (s !== 0) return s;
      }
    }
    if (ta === 5) {
      // binary
      // Surprisingly, a small binary blob is always less than a large one in
      // Mongo.
      if (a.length !== b.length) return a.length - b.length;
      for (i = 0; i < a.length; i++) {
        if (a[i] < b[i]) return -1;
        if (a[i] > b[i]) return 1;
      }
      return 0;
    }
    if (ta === 8) {
      // boolean
      if (a) return b ? 0 : 1;
      return b ? -1 : 0;
    }
    if (ta === 10) // null
      return 0;
    if (ta === 11) // regexp
      throw Error("Sorting not supported on regular expression"); // XXX
    // 13: javascript code
    // 14: symbol
    // 15: javascript code with scope
    // 16: 32-bit integer
    // 17: timestamp
    // 18: 64-bit integer
    // 255: minkey
    // 127: maxkey
    if (ta === 13) // javascript code
      throw Error("Sorting not supported on Javascript code"); // XXX
    throw Error("Unknown type to sort");
  }
};

var _$1 = { isArray: underscore.isArray, each: underscore.each };
// Like _.isArray, but doesn't regard polyfilled Uint8Arrays on old browsers as
// arrays.
// XXX maybe this should be EJSON.isArray
isArray = function isArray(x) {
  return _$1.isArray(x) && !EJSON.isBinary(x);
};
// XXX maybe this should be EJSON.isObject, though EJSON doesn't know about
// RegExp
// XXX note that _type(undefined) === 3!!!!
isPlainObject = function isPlainObject(x) {
  return x && _f._type(x) === 3;
};
isIndexable = function isIndexable(x) {
  return isArray(x) || isPlainObject(x);
};
// Returns true if this is an object with at least one key and all keys begin
// with $.  Unless inconsistentOK is set, throws if some keys begin with $ and
// others don't.
isOperatorObject = function isOperatorObject(valueSelector, inconsistentOK) {
  if (!isPlainObject(valueSelector)) return false;

  var theseAreOperators = undefined;
  _$1.each(valueSelector, function (value, selKey) {
    var thisIsOperator = selKey.substr(0, 1) === '$';
    if (theseAreOperators === undefined) {
      theseAreOperators = thisIsOperator;
    } else if (theseAreOperators !== thisIsOperator) {
      if (!inconsistentOK) throw new Error("Inconsistent operator: " + JSON.stringify(valueSelector));
      theseAreOperators = false;
    }
  });
  return !!theseAreOperators; // {} has no operators
};

// string can be converted to integer
isNumericKey = function isNumericKey(s) {
  return (/^[0-9]+$/.test(s)
  );
};

var _ = { all: underscore.all, each: underscore.each, keys: underscore.keys, has: underscore.has, isObject: isObject };
// XXX need a strategy for passing the binding of $ into this
// function, from the compiled selector
//
// maybe just {key.up.to.just.before.dollarsign: array_index}
//
// XXX atomicity: if one modification fails, do we roll back the whole
// change?
//
// options:
//   - isInsert is set when _modify is being called to compute the document to
//     insert as part of an upsert operation. We use this primarily to figure
//     out when to set the fields in $setOnInsert, if present.
var modify = function (doc, mod, options) {
  return LocalCollection._modify(doc, mod, _extends({}, options, { returnInsteadOfReplacing: true }));
};

LocalCollection = window && window.LocalCollection || global && global.LocalCollection || {};

LocalCollection._modify = function (doc, mod, options) {
  options = options || {};
  if (!isPlainObject(mod)) throw MinimongoError$1("Modifier must be an object");

  // Make sure the caller can't mutate our data structures.
  mod = EJSON.clone(mod);

  var isModifier = isOperatorObject(mod);

  var newDoc;

  if (!isModifier) {
    // replace the whole document
    assertHasValidFieldNames(mod);
    newDoc = mod;
  } else {
    // apply modifiers to the doc.
    newDoc = EJSON.clone(doc);
    _.each(mod, function (operand, op) {
      var modFunc = MODIFIERS[op];
      // Treat $setOnInsert as $set if this is an insert.
      if (!modFunc) throw MinimongoError$1("Invalid modifier specified " + op);
      _.each(operand, function (arg, keypath) {
        if (keypath === '') {
          throw MinimongoError$1("An empty update path is not valid.");
        }

        var keyparts = keypath.split('.');
        if (!underscore.all(keyparts)) {
          throw MinimongoError$1("The update path '" + keypath + "' contains an empty field name, which is not allowed.");
        }

        var noCreate = _.has(NO_CREATE_MODIFIERS, op);
        var forbidArray = op === "$rename";
        var target = findModTarget(newDoc, keyparts, {
          noCreate: NO_CREATE_MODIFIERS[op],
          forbidArray: op === "$rename",
          arrayIndices: options.arrayIndices
        });
        var field = keyparts.pop();
        modFunc(target, field, arg, keypath, newDoc);
      });
    });
  }

  if (options.returnInsteadOfReplacing) {
    return newDoc;
  } else {
    // move new document into place.
    _.each(_.keys(doc), function (k) {
      // Note: this used to be for (var k in doc) however, this does not
      // work right in Opera. Deleting from a doc while iterating over it
      // would sometimes cause opera to skip some keys.
      if (k !== '_id') delete doc[k];
    });
    _.each(newDoc, function (v, k) {
      doc[k] = v;
    });
  }
};

// for a.b.c.2.d.e, keyparts should be ['a', 'b', 'c', '2', 'd', 'e'],
// and then you would operate on the 'e' property of the returned
// object.
//
// if options.noCreate is falsey, creates intermediate levels of
// structure as necessary, like mkdir -p (and raises an exception if
// that would mean giving a non-numeric property to an array.) if
// options.noCreate is true, return undefined instead.
//
// may modify the last element of keyparts to signal to the caller that it needs
// to use a different value to index into the returned object (for example,
// ['a', '01'] -> ['a', 1]).
//
// if forbidArray is true, return null if the keypath goes through an array.
//
// if options.arrayIndices is set, use its first element for the (first) '$' in
// the path.
var findModTarget = function findModTarget(doc, keyparts, options) {
  options = options || {};
  var usedArrayIndex = false;
  for (var i = 0; i < keyparts.length; i++) {
    var last = i === keyparts.length - 1;
    var keypart = keyparts[i];
    var indexable = isIndexable(doc);
    if (!indexable) {
      if (options.noCreate) return undefined;
      var e = MinimongoError$1("cannot use the part '" + keypart + "' to traverse " + doc);
      e.setPropertyError = true;
      throw e;
    }
    if (doc instanceof Array) {
      if (options.forbidArray) return null;
      if (keypart === '$') {
        if (usedArrayIndex) throw MinimongoError$1("Too many positional (i.e. '$') elements");
        if (!options.arrayIndices || !options.arrayIndices.length) {
          throw MinimongoError$1("The positional operator did not find the " + "match needed from the query");
        }
        keypart = options.arrayIndices[0];
        usedArrayIndex = true;
      } else if (isNumericKey(keypart)) {
        keypart = parseInt(keypart);
      } else {
        if (options.noCreate) return undefined;
        throw MinimongoError$1("can't append to array using string field name [" + keypart + "]");
      }
      if (last)
        // handle 'a.01'
        keyparts[i] = keypart;
      if (options.noCreate && keypart >= doc.length) return undefined;
      while (doc.length < keypart) {
        doc.push(null);
      }if (!last) {
        if (doc.length === keypart) doc.push({});else if (_typeof(doc[keypart]) !== "object") throw MinimongoError$1("can't modify field '" + keyparts[i + 1] + "' of list value " + JSON.stringify(doc[keypart]));
      }
    } else {
      assertIsValidFieldName(keypart);
      if (!(keypart in doc)) {
        if (options.noCreate) return undefined;
        if (!last) doc[keypart] = {};
      }
    }

    if (last) return doc;
    doc = doc[keypart];
  }

  // notreached
};

var NO_CREATE_MODIFIERS = {
  $unset: true,
  $pop: true,
  $rename: true,
  $pull: true,
  $pullAll: true
};

var MODIFIERS = {
  $currentDate: function $currentDate(target, field, arg) {
    if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === "object" && arg.hasOwnProperty("$type")) {
      if (arg.$type !== "date") {
        throw MinimongoError$1("Minimongo does currently only support the date type " + "in $currentDate modifiers", { field: field });
      }
    } else if (arg !== true) {
      throw MinimongoError$1("Invalid $currentDate modifier", { field: field });
    }
    target[field] = new Date();
  },
  $min: function $min(target, field, arg) {
    if (typeof arg !== "number") {
      throw MinimongoError$1("Modifier $min allowed for numbers only", { field: field });
    }
    if (field in target) {
      if (typeof target[field] !== "number") {
        throw MinimongoError$1("Cannot apply $min modifier to non-number", { field: field });
      }
      if (target[field] > arg) {
        target[field] = arg;
      }
    } else {
      target[field] = arg;
    }
  },
  $max: function $max(target, field, arg) {
    if (typeof arg !== "number") {
      throw MinimongoError$1("Modifier $max allowed for numbers only", { field: field });
    }
    if (field in target) {
      if (typeof target[field] !== "number") {
        throw MinimongoError$1("Cannot apply $max modifier to non-number", { field: field });
      }
      if (target[field] < arg) {
        target[field] = arg;
      }
    } else {
      target[field] = arg;
    }
  },
  $inc: function $inc(target, field, arg) {
    if (typeof arg !== "number") throw MinimongoError$1("Modifier $inc allowed for numbers only", { field: field });
    if (field in target) {
      if (typeof target[field] !== "number") throw MinimongoError$1("Cannot apply $inc modifier to non-number", { field: field });
      target[field] += arg;
    } else {
      target[field] = arg;
    }
  },
  $set: function $set(target, field, arg) {
    if (!_.isObject(target)) {
      // not an array or an object
      var e = MinimongoError$1("Cannot set property on non-object field", { field: field });
      e.setPropertyError = true;
      throw e;
    }
    if (target === null) {
      var e = MinimongoError$1("Cannot set property on null", { field: field });
      e.setPropertyError = true;
      throw e;
    }
    assertHasValidFieldNames(arg);
    target[field] = arg;
  },
  $setOnInsert: function $setOnInsert(target, field, arg) {
    // converted to `$set` in `_modify`
  },
  $unset: function $unset(target, field, arg) {
    if (target !== undefined) {
      if (target instanceof Array) {
        if (field in target) target[field] = null;
      } else delete target[field];
    }
  },
  $push: function $push(target, field, arg) {
    if (target[field] === undefined) target[field] = [];
    if (!(target[field] instanceof Array)) throw MinimongoError$1("Cannot apply $push modifier to non-array", { field: field });

    if (!(arg && arg.$each)) {
      // Simple mode: not $each
      assertHasValidFieldNames(arg);
      target[field].push(arg);
      return;
    }

    // Fancy mode: $each (and maybe $slice and $sort and $position)
    var toPush = arg.$each;
    if (!(toPush instanceof Array)) throw MinimongoError$1("$each must be an array", { field: field });
    assertHasValidFieldNames(toPush);

    // Parse $position
    var position = undefined;
    if ('$position' in arg) {
      if (typeof arg.$position !== "number") throw MinimongoError$1("$position must be a numeric value", { field: field });
      // XXX should check to make sure integer
      if (arg.$position < 0) throw MinimongoError$1("$position in $push must be zero or positive", { field: field });
      position = arg.$position;
    }

    // Parse $slice.
    var slice = undefined;
    if ('$slice' in arg) {
      if (typeof arg.$slice !== "number") throw MinimongoError$1("$slice must be a numeric value", { field: field });
      // XXX should check to make sure integer
      if (arg.$slice > 0) throw MinimongoError$1("$slice in $push must be zero or negative", { field: field });
      slice = arg.$slice;
    }

    // Parse $sort.
    var sortFunction = undefined;
    if (arg.$sort) {
      if (slice === undefined) throw MinimongoError$1("$sort requires $slice to be present", { field: field });
      // XXX this allows us to use a $sort whose value is an array, but that's
      // actually an extension of the Node driver, so it won't work
      // server-side. Could be confusing!
      // XXX is it correct that we don't do geo-stuff here?
      sortFunction = new Minimongo.Sorter(arg.$sort).getComparator();
      for (var i = 0; i < toPush.length; i++) {
        if (_f._type(toPush[i]) !== 3) {
          throw MinimongoError$1("$push like modifiers using $sort " + "require all elements to be objects", { field: field });
        }
      }
    }

    // Actually push.
    if (position === undefined) {
      for (var j = 0; j < toPush.length; j++) {
        target[field].push(toPush[j]);
      }
    } else {
      var spliceArguments = [position, 0];
      for (var j = 0; j < toPush.length; j++) {
        spliceArguments.push(toPush[j]);
      }Array.prototype.splice.apply(target[field], spliceArguments);
    }

    // Actually sort.
    if (sortFunction) target[field].sort(sortFunction);

    // Actually slice.
    if (slice !== undefined) {
      if (slice === 0) target[field] = []; // differs from Array.slice!
      else target[field] = target[field].slice(slice);
    }
  },
  $pushAll: function $pushAll(target, field, arg) {
    if (!((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === "object" && arg instanceof Array)) throw MinimongoError$1("Modifier $pushAll/pullAll allowed for arrays only");
    assertHasValidFieldNames(arg);
    var x = target[field];
    if (x === undefined) target[field] = arg;else if (!(x instanceof Array)) throw MinimongoError$1("Cannot apply $pushAll modifier to non-array", { field: field });else {
      for (var i = 0; i < arg.length; i++) {
        x.push(arg[i]);
      }
    }
  },
  $addToSet: function $addToSet(target, field, arg) {
    var isEach = false;
    if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === "object") {
      //check if first key is '$each'
      var _keys = Object.keys(arg);
      if (_keys[0] === "$each") {
        isEach = true;
      }
    }
    var values = isEach ? arg["$each"] : [arg];
    assertHasValidFieldNames(values);
    var x = target[field];
    if (x === undefined) target[field] = values;else if (!(x instanceof Array)) throw MinimongoError$1("Cannot apply $addToSet modifier to non-array", { field: field });else {
      _.each(values, function (value) {
        for (var i = 0; i < x.length; i++) {
          if (_f._equal(value, x[i])) return;
        }x.push(value);
      });
    }
  },
  $pop: function $pop(target, field, arg) {
    if (target === undefined) return;
    var x = target[field];
    if (x === undefined) return;else if (!(x instanceof Array)) throw MinimongoError$1("Cannot apply $pop modifier to non-array", { field: field });else {
      if (typeof arg === 'number' && arg < 0) x.splice(0, 1);else x.pop();
    }
  },
  $pull: function $pull(target, field, arg) {
    if (target === undefined) return;
    var x = target[field];
    if (x === undefined) return;else if (!(x instanceof Array)) throw MinimongoError$1("Cannot apply $pull/pullAll modifier to non-array", { field: field });else {
      var out = [];
      if (arg != null && (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === "object" && !(arg instanceof Array)) {
        // XXX would be much nicer to compile this once, rather than
        // for each document we modify.. but usually we're not
        // modifying that many documents, so we'll let it slide for
        // now

        // XXX Minimongo.Matcher isn't up for the job, because we need
        // to permit stuff like {$pull: {a: {$gt: 4}}}.. something
        // like {$gt: 4} is not normally a complete selector.
        // same issue as $elemMatch possibly?
        var matcher = new Minimongo.Matcher(arg);
        for (var i = 0; i < x.length; i++) {
          if (!matcher.documentMatches(x[i]).result) out.push(x[i]);
        }
      } else {
        for (var i = 0; i < x.length; i++) {
          if (!_f._equal(x[i], arg)) out.push(x[i]);
        }
      }
      target[field] = out;
    }
  },
  $pullAll: function $pullAll(target, field, arg) {
    if (!((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === "object" && arg instanceof Array)) throw MinimongoError$1("Modifier $pushAll/pullAll allowed for arrays only", { field: field });
    if (target === undefined) return;
    var x = target[field];
    if (x === undefined) return;else if (!(x instanceof Array)) throw MinimongoError$1("Cannot apply $pull/pullAll modifier to non-array", { field: field });else {
      var out = [];
      for (var i = 0; i < x.length; i++) {
        var exclude = false;
        for (var j = 0; j < arg.length; j++) {
          if (_f._equal(x[i], arg[j])) {
            exclude = true;
            break;
          }
        }
        if (!exclude) out.push(x[i]);
      }
      target[field] = out;
    }
  },
  $rename: function $rename(target, field, arg, keypath, doc) {
    if (keypath === arg)
      // no idea why mongo has this restriction..
      throw MinimongoError$1("$rename source must differ from target", { field: field });
    if (target === null) throw MinimongoError$1("$rename source field invalid", { field: field });
    if (typeof arg !== "string") throw MinimongoError$1("$rename target must be a string", { field: field });
    if (arg.indexOf('\0') > -1) {
      // Null bytes are not allowed in Mongo field names
      // https://docs.mongodb.com/manual/reference/limits/#Restrictions-on-Field-Names
      throw MinimongoError$1("The 'to' field for $rename cannot contain an embedded null byte", { field: field });
    }
    if (target === undefined) return;
    var v = target[field];
    delete target[field];

    var keyparts = arg.split('.');
    var target2 = findModTarget(doc, keyparts, { forbidArray: true });
    if (target2 === null) throw MinimongoError$1("$rename target field invalid", { field: field });
    var field2 = keyparts.pop();
    target2[field2] = v;
  },
  $bit: function $bit(target, field, arg) {
    // XXX mongo only supports $bit on integers, and we only support
    // native javascript numbers (doubles) so far, so we can't support $bit
    throw MinimongoError$1("$bit is not supported", { field: field });
  }
};

module.exports = modify;
