import mongoose from '../config/dbHelper'

const Schema = mongoose.Schema;
const UserSchema = new Schema( {
    'username': { type: String },
    'password': { type: String } ,
    'email': { type: String },
    'createTime': { type: String }
});
// 连接connections，model + Schema
const UserModel = mongoose.model('users', UserSchema );
export default UserModel;