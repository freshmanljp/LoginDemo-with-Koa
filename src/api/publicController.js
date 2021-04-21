import svgCaptacha from 'svg-captcha';
import { setValue } from '../config/redisConfig';

class PublicController {
  constructor() {}
  async user(ctx) {
    const { body, header } = ctx.request;
    const { name, email } = body;
    const { role } = header;
    if (!role || role !== 'admin') {
      ctx.body = {
        code: 401,
        msg: 'unauthorized post',
      };
    } else {
      if (!name || !email) {
        ctx.body = {
          code: 404,
          msg: 'name与email不得为空',
        };
      } else {
        ctx.body = {
          code: 200,
          msg: '上传成功',
          data: {
            ...body,
          },
        };
      }
    }
  }
  async getCaptcha(ctx) {
    const params = ctx.request.query;
    if (params.sid) {
      const newCaptca = svgCaptacha.create({
        size: 4,
        ignoreChars: '0o1i',
        // 随机0到4条干扰线
        noise: Math.random() * 4,
        color: true,
        width: 150,
        height: 40
      });
      // 保存图片验证码数据到redis数据库，设置超时时间，单位: s
      // 设置图片验证码超时10分钟
      await setValue(params.sid, newCaptca.text, 60*10);
  
      ctx.body = {
        code: 200,
        data: newCaptca.data,
      };
    } else {
      ctx.status = 403;
      ctx.body = {
        code: 403,
        msg: "缺少sid参数"
      }
    }
  }
}

export default new PublicController();
