const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const queryString = require('query-string');

const cors = require('./utils/cors');
const cookie = require('./utils/cookie');
const mock = require('./utils/mock');
const models = require('./category');

const app = new Koa();
const router = new Router();

router.all('/blob/:file', ctx => {
  const { file } = ctx.params;
  const filePath = path.join(__dirname, `./blob/${file}`);
  if (fs.existsSync(filePath)) {
    ctx.body = fs.createReadStream(filePath);
  } else {
    ctx.body = `没有对应文件--${file}`;
  }
});

router.all('/api/:cate', ctx => {
  const { cate } = ctx.params;
  const { type } = queryString.parse(ctx.search);
  const model = models[cate];
  if (model) {
    ctx.body = mock(type, model);
  } else {
    ctx.status = 404;
    ctx.body = `没有对应模型--${cate}`;
  }
});

app
  .use(cors)
  .use(cookie)
  .use(router.routes())
  .listen(9999);
