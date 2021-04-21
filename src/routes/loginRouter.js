import Router from 'koa-router';
import loginController from '../api/loginController';

const router = new Router();

router.prefix('/login'); // 加路由前缀

router.post('/auth', loginController.auth);
router.post('/forget', loginController.forgetMailSend);
router.post('/reg', loginController.reg);

export default router;