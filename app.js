const fs = require('fs');
const path = require('path');

const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const queryString = require('query-string');

const models = require('./models');
const mock = require('./utils/mock');
const speed = require('./middlewares/speed');
const cookie = require('./middlewares/cookie');

const app = new Koa();
const router = new Router();

router.all('/blob/:file', ctx => {
  const { file } = ctx.params;
  const { type } = queryString.parse(ctx.search);
  const filePath = path.join(__dirname, `./blob/${file}`);
  if (fs.existsSync(filePath)) {
    if (type === 'chunked') {
      ctx.body = fs.createReadStream(filePath);
    } else {
      ctx.body = fs.readFileSync(filePath);
    }
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
  .use(
    cors({
      credentials: true
    })
  )
  .use(speed)
  .use(cookie)
  .use(router.routes())
  .listen(9999);
