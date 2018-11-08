module.exports = async function cookie(ctx, next) {
  ctx.cookies.set('name', 'tarol', {
    domain: 'tarol.com',
    httpOnly: false
  });
  // ctx.cookies.get('path') || ctx.append('Set-Cookie', `path=${ctx.request.path}`);
  await next();
};
