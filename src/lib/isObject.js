export default (variableToCheck) => {
  return (typeof variableToCheck === "object") && (variableToCheck !== null)
}