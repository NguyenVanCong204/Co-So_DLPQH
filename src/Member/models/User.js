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

export default User;
