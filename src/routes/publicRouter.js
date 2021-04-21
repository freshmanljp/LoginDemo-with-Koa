import Router from 'koa-router';
import PublicController from '../api/publicController';
const router = new Router();

router.prefix('/public'); // 加路由前缀

router.post('/user', PublicController.user);

router.get('/getCaptcha', PublicController.getCaptcha);

router.get('/api', (ctx) => {
  ctx.body = 'hello api';
});

export default router;
