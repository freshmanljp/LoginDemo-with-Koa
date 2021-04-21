"use strict";
const nodemailer = require("nodemailer");
import config from '.';

// let infoFormat = {
//   user: '张敬轩四十岁老处男di粉丝',
//   email: '2984713743@qq.com',
//   expired: '2021-2-1 13:45',
//   code: '1208'
// }

// async..await is not allowed in global scope, must use a wrapper
async function main(info) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    host: "smtp.qq.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.MAIL.user, // generated ethereal user
      pass: config.MAIL.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let sendInfo = await transporter.sendMail({
    from: '"认证邮件 👻" <1498725065@qq.com>', // sender address
    to: info.email, // list of receivers
    subject: info.user ? `Hello ${info.user}` : '你好，有兴趣了解一下Hins吗', // Subject line
    // text: `你的验证码是${configInfo.code}`, // plain text body
    html: `
    <div style="border: 1px solid #dcdcdc;color: #676767;width: 600px; margin: 0 auto; padding-bottom: 50px;position: relative;">
      <div style="height: 60px; background: #393d49; line-height: 60px; color: #58a36f; font-size: 18px;padding-left: 10px;">Imooc社区——欢迎来到官方社区</div>
      <div style="padding: 25px">
        <div>您好，${info.user}童鞋，重置链接有效时间30分钟，请在${info.expried}之前重置您的密码：</div>
        <a href="${info.url}" style="padding: 10px 20px; color: #fff; background: #009e94; display: inline-block;margin: 15px 0;">立即重置密码</a>
        <div style="padding: 5px; background: #f2f2f2;">如果该邮件不是由你本人操作，请勿进行激活！否则你的邮箱将会被他人绑定。</div>
      </div>
      <div style="background: #fafafa; color: #b4b4b4;text-align: center; line-height: 45px; height: 45px; position: absolute; left: 0; bottom: 0;width: 100%;">系统邮件，请勿直接回复</div>
    </div>
    `, // html body
  });

  return "Message sent: %s", sendInfo.messageId;
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export default main;

// 授权码
// bkuboevwuuughcdg