const Mock = require('mockjs');

function mock(type, model) {
  if (type === 'array') {
    return mockArray(model);
  } else {
    return mockObject(model);
  }
}

function mockArray(model) {
  const key = 'array';
  return Mock.mock({
    [`${key}|5-10`]: [model]
  })[key];
}

function mockObject(model) {
  return Mock.mock(model);
}

module.exports = mock;
