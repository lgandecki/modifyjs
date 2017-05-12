export default (arrayToIterate, cb) => {
  return arrayToIterate.every((elem) => ((cb && cb(elem)) || elem));
}