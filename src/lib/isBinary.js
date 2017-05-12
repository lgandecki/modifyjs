export default (variableToCheck) => {
  return !!((typeof Uint8Array !== 'undefined' && variableToCheck instanceof Uint8Array) ||
  (variableToCheck && variableToCheck.$Uint8ArrayPolyfill));
};
