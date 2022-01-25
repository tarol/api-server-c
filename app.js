const cluster = require('cluster');
const fs = require('fs-extra');
const path = require('path');
const http = require('http');
const { cpus } = require('os');

const Koa = require('koa');
const cors = require('koa2-cors');
const serve = require('koa-static');
const koaBody = require('koa-body');
const Router = require('koa-router');
const favicon = require('koa-favicon');
const compress = require('koa-compress');
const sse = require('koa-sse-stream');

const PORT = 9999;
const initWs = require('./ws');
const models = require('./models');
const mock = require('./utils/mock');
const { formatQuery } = require('./utils/_');
const speed = require('./middlewares/speed');
const cookie = require('./middlewares/cookie');
const mime = require('./middlewares/mime');

if(cluster.isMaster) {
  console.log(`Primary ${process.pid} is running`);
  // 衍生工作进程。
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app = new Koa();
  const server = http.createServer(app.callback());
  const router = new Router();

  initWs(server);

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

  router.get('/sse', ctx => {
    ctx.sse.send('a');
    setTimeout(() => {
      ctx.sse.send('b');
    }, 1000);
    setTimeout(() => {
      ctx.sse.send('c');
    }, 2000);
    setTimeout(() => {
      ctx.sse.sendEnd();
    }, 3000);
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
    .use(sse({
      maxClients: 5000,
      pingInterval: 30000
    }))
    .use(router.routes());
  server.listen(PORT, function() {
    console.log(`Worker ${process.pid} started`);
  });
}

