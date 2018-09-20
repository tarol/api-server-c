const { mapValues } = require('lodash/fp');

exports.formatQuery = function(obj) {
  return mapValues(i => (isNaN(i) ? i : +i))(obj);
};
