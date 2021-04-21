import { getValue } from '../config/redisConfig'

// 从redis中查询key对应的value是否正确，忽略大小写的区别，并排除key在数据库中不存在的情况
// 注意，没有非空验证
const checkCaptcha = async (key, value) => {
  const result = await getValue(key);
  if (result !== null) {
    if (result.toLowerCase() === value.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  } else {
    return false
  }
}

export {
  checkCaptcha,
}