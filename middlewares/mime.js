const path = require('path');
const mime = require('mime-types');

module.exports = async function(ctx, next) {
  const type = mime.lookup(path.extname(ctx.url));
  if (type) {
    ctx.append('Content-Type', type);
  }
  await next();
};
