import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import koaJson from 'koa-json';
import KoaRouter from 'koa-router';
import router from './routes/routes';
import compose from 'koa-compose';
import compress from 'koa-compress';
import koaStatic from 'koa-static';
import helmet from 'koa-helmet';
import JWT from 'koa-jwt';
import config from './config';
import path from 'path';
import errorHandle from './common/ErrorHandle';

const koaRouter = new KoaRouter();
const app = new Koa();
// 判断当前是否处于开发环境
const isDevMode = process.env.NODE_ENV === 'production' ? false : true;
// console.log(process.env.NODE_ENV);

// 静态资源目录配置，将public文件夹下的资源映射到/目录
const statics = koaStatic(path.join(__dirname, '../public'));

// jwt鉴权相关配置
// 定义公共路径，不需要jwt鉴权，public开头和login开头的路径不需要鉴权
const jwt = JWT({ secret: config.JWT.secret }).unless({ path: [/^\/public/, /^\/login\/auth/, /^\/login\/reg/] });

// 中间件的定义
// const middleware1 = function async(ctx, next) {
//   console.log('this is middleware1 request handle');
//   next();
//   console.log('this is middleware1 response handle');
// };

// const middleware2 = function async(ctx, next) {
//   console.log('this is middleware2 request handle');
//   next();
//   console.log('this is middleware2 response handle');
// };

// 路由前缀的添加
// router.prefix('/api');

// 路由定义
// router.get('/', (ctx) => {
//   ctx.body = 'hello koa';
// });
// router.get('/api', (ctx) => {
//   ctx.body = 'hello api';
// });

// 路由参数的获取
// router.post('/postTest', (ctx) => {
//   const { body } = ctx.request;
//   console.log(body);
//   ctx.body = {
//     code: 200,
//     ...body,
//   };
// });
// router.get('/getParams', (ctx) => {
//   ctx.body = ctx.request.query;
// });

// 注意中间件的书写顺序,注意第三方中间件往往需要进行初始化调用
// app.use(koaBody());
// app.use(cors());
// app.use(koaJson({ pretty: false, param: 'pretty' }));
// app.use(middleware1);
// app.use(middleware2);
// app.use(router.routes()).use(router.allowedMethods());

// 利用koa-compose进行中间件集合
const middleware = compose([
  koaBody(),
  statics,
  helmet(),
  cors(),
  koaJson({ pretty: false, param: 'pretty' }),
  // middleware1,
  // middleware2,
  errorHandle, // 错误处理
  jwt,
]);

// 若为生产环境，使用koa-compress进行中间件的压缩
if (!isDevMode) {
  // 使用了koa-compose貌似直接调用compress()即可，不需要往里填参数
  app.use(compress());
}

app.use(middleware);
// allowedMethods处理的业务是当所有路由中间件执行完成之后,若ctx.status为空或者404的时候,丰富response对象的header头.
app.use(router()).use(koaRouter.allowedMethods()); // router中间件放最后，并注意使用combine-router后中间件的引用方式发生改变

app.listen(config.PORT, () => {
  console.log(`The server is working at ${config.PORT}`);
});