const sleep = require('../utils/sleep');

module.exports = async function speed(ctx, next) {
  if (ctx.get('x-speed-mode') === 'tortoise') {
    await sleep(3000);
    await next();
  } else {
    await next();
  }
};
