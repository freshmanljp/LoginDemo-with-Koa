import forget from '../config/mailConfig';
import moment from 'moment';
import jsonwebtoken from 'jsonwebtoken';
import config from '../config';
import { checkCaptcha } from '../common/utils'
import User from '@/model/User';
import bcrypt from 'bcrypt';

class LoginController {
  constructor() {}
  async auth (ctx) {
    // 接收用户的数据
    const { body } = ctx.request;
    // console.log(body)
    const { username, password, sid, code } = body;

    // 验证图片验证码的时效性，正确性
    const checkCode =  (typeof sid === 'undefined' || sid === '') || (typeof code === 'undefined' || code === '') ? false : await checkCaptcha(sid, code);
    if (checkCode) {
      
      // 验证用户账号密码是否正确
      let checkPass = false;
      // mongoDB查询密码
      const user = await User.findOne({ email: username });
      checkPass =  user ? await bcrypt.compare(password, user.password) : false;
      // checkPass =  user.password === password ? true : false;
      if (checkPass) {
        // 返回token
        console.log('get login request');
        let payload = {
          id: 'ljp',
          // exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 第一种方式，在payload中设置过期时间
        }
        // let token = jsonwebtoken.sign(payload, config.JWT_SECRET); // 设置过期方式1
        let token = jsonwebtoken.sign(payload, config.JWT.secret, { expiresIn: config.JWT.expried })
        
        ctx.body = {
          code: 200,
          token: token,
        }
      } else {
        ctx.status = 403
        ctx.body = {
          code: 403,
          msg: '用户名或者密码错误'
        }
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 403,
        msg: '图片验证码错误或者已过期'
      }
    }
  }
  
  async reg (ctx) {
    console.log('get reg request');
    // 接收用户的数据
    const { body } = ctx.request;
    // 获取相关表单信息
    let { email, username, password, code, sid } = body;
    // 定义用户表单中的错误信息
    const msg = {};
    // 邮箱和昵称的唯一性验证变量
    let isUnique = true;

    // 验证验证码的时效性和正确性
    const checkCode = ((typeof sid === 'undefined' || sid === '') || (typeof code === 'undefined' || sid === '')) ? false : await checkCaptcha(sid, code);
    if (checkCode) {
      // 验证邮箱和昵称的唯一性
      const user1 = await User.findOne({ email: email });
      if (user1 && typeof user1.email !== 'undefined') {
        msg.email = ['该邮箱已被注册，可以从忘记密码处找回'];
        isUnique = false;
      }
      const user2 = await User.findOne({ username: username });
      if (user2 && typeof user2.username !== 'undefined') {
        msg.username = ['该用户名已被注册，请修改'];
        isUnique = false;
      }
      console.log(user1, user2)

      // 密码加密并存储于数据库中
      if (isUnique) {
        // 密码加盐
        password = await bcrypt.hash(password, 5);
        const newUser = new User({
          username,
          email,
          password,
          createTime: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        const result = await newUser.save();
        ctx.body = {
          code: 200,
          msg: '注册成功',
          data: result
        };
        return;
      }
    } else {
      // veevalidate 的错误显示
      msg.code = ['图片验证码错误或者已过期'];
    }
    ctx.body = {
      code: 403,
      msg: msg
    }
  }

  async forgetMailSend (ctx) {
    const { body } = ctx.request;
    const { username } = body;
    const mailConfig = {
      user: 'ljp',
      email: username,
      expried: moment().add(30, 'm').format('YYYY-MM-DD HH:mm:ss'),
      code: 1234,
      url: 'http://www.bilibili.com'
    }
    try {
      const result = await forget(mailConfig);
      ctx.body = {
        status: 200,
        data: result,
        msg: '邮件发送成功'
      }
    } catch(e) {
      console.log(e);
      ctx.body = {
        code: 500,
        msg: '邮件发送失败，很多种可能原因'
      }
    }
  }
}

export default new LoginController();