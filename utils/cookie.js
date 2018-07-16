module.exports = function(ctx, next) {
  ctx.get('Origin') && ctx.append('Set-Cookie', 'name=tarol; Path=/');
  next();
};
