export default (objectToIterate, cb) => {
  Object.keys(objectToIterate).forEach((key) => {
    cb(objectToIterate[key], key);
  })
}