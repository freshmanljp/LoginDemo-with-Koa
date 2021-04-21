// demo.js 用于进行数据库的业务逻辑操作
import User from './User.js'

//增
const user = {
  username: 'ljp',
  password: '123456',
  email: '123@qq.com'
}
const insertMethods = async () => {
  const data = new User(user)
  const result = await data.save()
  console.log(result)
}

//查
const findMethods = async () => {
  const result = await User.find()
  console.log(result)
}

//改
const updateMethods = async () => {
  const result = await User.updateOne({ name: 'brian' },
  {
    email: 'imooc@qq.com'
  })
  console.log(result)
}

//删
const deleteMethods = async () => {
  const result = await User.deleteOne({ name: 'brian' })
  console.log(result)
}

insertMethods();

// findMethods();

// updateMethods();

// deleteMethods();