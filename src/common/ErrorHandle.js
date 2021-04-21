// 错误处理函数

const errorHandle = (ctx, next) => {
  return next().catch((err) => {
    // 鉴权的错误处理
    if (err.status == 401) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        msg: 'Protected resource, use Authorization header to get access'
      }
    } else {
      // 通用错误处理
      console.log(process.env.NODE_ENV)
      ctx.status = err.status || 500
      const res = Object.assign({ 
        code: 500,
        msg: err.message
      }, process.env.NODE_ENV === 'development' ? { stack: err.stack } : {});
      ctx.body = res;
    }
  });
} 

export default errorHandle;