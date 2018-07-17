module.exports = async function cookie(ctx, next) {
  ctx.get('Origin') && ctx.append('Set-Cookie', 'name=tarol; Path=/');
  await next();
};
