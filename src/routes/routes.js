import routerCombine from 'koa-combine-routers';
import publicRouter from './publicRouter';
import loginRouter from './loginRouter';

export default routerCombine(publicRouter, loginRouter);
