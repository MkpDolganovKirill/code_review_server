module.exports = function body(body) {
  const exists = (propName) => {
    if (!body.hasOwnProperty(propName)) {
      throw new Error(`Property '${propName}' does not exists`);
    }
    return { exists }
  }

  const existMany = (...propsNames) => {
    propsNames.forEach((propName) => {
      if (!body.hasOwnProperty(propName)) {
        throw new Error(`Property '${propName}' does not exists`);
      }
    });
  }

  return {
    exists,
    existMany
  }
}
