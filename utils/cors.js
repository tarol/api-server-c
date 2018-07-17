module.exports = function(ctx, next) {
  ctx.set('Access-Control-Allow-Origin', ctx.get('Origin') || '*');
  ctx.set('Access-Control-Allow-Credentials', true);
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200;
  }else {
    next();
  }
};
