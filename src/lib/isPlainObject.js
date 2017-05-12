import {isArray} from './../helpers';
import isBinary from './../lib/isBinary';

export default (variableToCheck) => {
    if (!variableToCheck)
      return false;
    if (typeof variableToCheck === "number")
      return false;
    if (typeof variableToCheck === "string")
      return false;
    if (typeof variableToCheck === "boolean")
      return false;
    if (isArray(variableToCheck))
      return false;
    if (variableToCheck === null)
      return false;
    if (variableToCheck instanceof RegExp)
    // note that typeof(/x/) === "object"
      return false;
    if (typeof variableToCheck === "function")
      return false;
    if (variableToCheck instanceof Date)
      return false;
    if (isBinary(variableToCheck))
      return false;

    return true; // object
}
