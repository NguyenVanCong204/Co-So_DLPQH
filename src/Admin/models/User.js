import User from "../../models/User.js";
import bcrypt from "bcryptjs";

User.createUser = async function (data) {
  return await this.create(data);
};
User.checkEmail = async function (email) {
  const existingUser = await this.findOne({ email });
  const error = {};
  if (existingUser) {
    error.email = "Email đã tồn tại";
  }
  return error;
};
User.getUser = async function (id) {
  return await this.findOne({ id });
};
User.checkLoginUser = async function (data) {
  data.level = parseInt(data.level);
  const user = await this.findOne({ email: data.email, level: data.level });
  if (!user) {
    return false;
  }
  const pass = await bcrypt.compare(data.password, user.password);
  if (!pass) {
    return false;
  }
  return user;
};
export default User;
