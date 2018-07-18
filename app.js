const fs = require('fs-extra');
const path = require('path');

const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const koaBody = require('koa-body');

const models = require('./models');
const mock = require('./utils/mock');
const speed = require('./middlewares/speed');
const cookie = require('./middlewares/cookie');

const app = new Koa();
const router = new Router();

router.post(
  '/upload',
  koaBody({
    multipart: true,
    patchKoa: true
  }),
  ctx => {
    const { file } = ctx.request.files;
    const { name = Date.now() } = ctx.request.body;
    const filePath = path.join(__dirname, `.tmp/${name}`);
    fs.ensureFileSync(filePath);
    fs.createReadStream(file.path).pipe(fs.createWriteStream(filePath));
    ctx.body = fs.createReadStream(file.path);
  }
);

router.get('/blob/:file', ctx => {
  const { file } = ctx.params;
  const { type } = ctx.query;
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

router.get('/api/:cate', speed, ctx => {
  const { cate } = ctx.params;
  const { type } = ctx.query;
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
  .use(cookie)
  .use(router.routes())
  .listen(9999);
