module.exports = function(ctx, next) {
  ctx.set('Access-Control-Allow-Origin', ctx.get('Origin') || '*');
  ctx.set('Access-Control-Allow-Credentials', true);
  next();
};
