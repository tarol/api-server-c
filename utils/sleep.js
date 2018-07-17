module.exports = function(time) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, time);
  });
};
