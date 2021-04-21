export default {
  PORT: 3000,
  DB_URL: 'mongodb://test:123456@localhost:27017/test',
  REDIS: {
    host: '127.0.0.1',
    port: 6379,
    password: '123456',
  },
  MAIL: {
    user: '1498725065@qq.com', 
    pass: 'bkuboevwuuughcdg',
  },
  JWT: {
    secret: 'qq1498725065aaas',
    expried: 60 * 60 // 过期时间，毫秒为单位
  }
}