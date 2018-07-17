module.exports = async function cors(ctx, next) {
  ctx.set('Access-Control-Allow-Origin', ctx.get('Origin') || '*');
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Allow-Headers', '*');
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
  } else {
    await next();
  }
};
