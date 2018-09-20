const Mock = require('mockjs');
const { merge } = require('lodash/fp');

function mock(type, model, { size, total, ...rest }) {
  if (type === 'array') {
    return mockArray(model);
  } else if (type === 'computedArray') {
    return merge({
      data: mockArray(model, size)
    })(
      Mock.mock({
        total: total || `@natural(${size * 5}, ${size * 50})`,
        size: size,
        ...rest
      })
    );
  } else {
    return mockObject(model);
  }
}

function mockArray(model, size = '5-10') {
  const key = 'array';
  return Mock.mock({
    [`${key}|${size}`]: [model]
  })[key];
}

function mockObject(model) {
  return Mock.mock(model);
}

module.exports = mock;
