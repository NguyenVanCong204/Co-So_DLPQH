import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Country from "./Country.js";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  id_country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  avatar: String,
  level: { type: Number, default: 1 },
});

userSchema.statics.createUser = async function (data) {
  return await this.create(data);
};
userSchema.statics.checkEmail = async function (email) {
  const existingUser = await this.findOne({ email });
  const error = {};
  if (existingUser) {
    error.email = "Email đã tồn tại";
  }
  return error;
};
userSchema.static.checkCountry = async function (id_country) {
  const country = await Country.findById(id_country);
  const error = {};
  if (!country) {
    error.id_country = "Quốc gia không tồn tại trong hệ thống";
  }
  return error;
};
userSchema.statics.getUser = async function (_id) {
  return await this.findOne({ _id });
};
userSchema.statics.checkLoginUser = async function (data) {
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
userSchema.statics.updateUser = async function (id, data) {
  return await this.findByIdAndUpdate(id, data, { new: true });
};

const User = mongoose.model("User", userSchema);
export default User;
