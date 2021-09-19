const fs = require('fs-extra');
const path = require('path');
const http = require('http');

const Koa = require('koa');
const cors = require('koa2-cors');
const serve = require('koa-static');
const koaBody = require('koa-body');
const Router = require('koa-router');
const favicon = require('koa-favicon');
const compress = require('koa-compress');

const PORT = 9999;
const models = require('./models');
const mock = require('./utils/mock');
const { formatQuery } = require('./utils/_');
const speed = require('./middlewares/speed');
const cookie = require('./middlewares/cookie');
const mime = require('./middlewares/mime');

const app = new Koa();
const server = http.createServer(app.callback());
const io = require('socket.io')(server);
const router = new Router();

io.on('connection', socket => {
  socket.on('request', v => {
    socket.emit('response', v);
  });
});

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
  const { type, ...query } = formatQuery(ctx.query);
  const model = models[cate];
  if (model) {
    ctx.body = mock(type, model, query);
  } else {
    ctx.status = 404;
    ctx.body = `没有对应模型--${cate}`;
  }
});

app
  .use(compress())
  .use(
    cors({
      credentials: true,
      maxAge: 60 * 60
    })
  )
  .use(cookie)
  .use(mime)
  .use(favicon('favicon.jpg'))
  .use(serve('public'))
  .use(router.routes());
server.listen(PORT, function() {
  console.log(`listen to ${PORT}`);
});
