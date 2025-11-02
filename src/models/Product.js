import mongoose from "mongoose";
import Category from "./Category.js";
import Brand from "./Brand.js";
import User from "./User.js";

const productSchema = new mongoose.Schema({
  id_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    require: true,
  },
  id_brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    require: true,
  },
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  name: String,
  image: String,
  price: Number,
  status: Number,
  sale: Number,
  detail: String,
  company: String,
  qualty: {
    type: Number,
    require: true,
  },
});
productSchema.statics.checkCategory = async function (id_category) {
  const category = await Category.findById(id_category);
  const error = {};
  if (!category) {
    error.category = "Loại sản phẩm không tồn tại trong hệ thống";
  }
  return error;
};
productSchema.statics.checkBrand = async function (id_brand) {
  const brand = await Brand.findById(id_brand);
  const error = {};
  if (!brand) {
    error.brand = "Thương hiệu không tồn tại trong hệ thống";
  }
  return error;
};
productSchema.statics.checkUser = async function (id_user) {
  const user = await User.findById(id_user);
  const error = {};
  if (!user) {
    error.user = "Người dùng không tồn tại trong hệ thống";
  }
  return error;
};
productSchema.statics.createProduct = async function (data) {
  return await this.create(data);
};
productSchema.statics.getProduct = async function () {
  return await this.find();
};
productSchema.statics.getProductByIdUser = async function (userId) {
  return await this.find({ id_user: userId });
};
productSchema.statics.getProductById = async function (id) {
  return await this.findOne({ _id: id });
};
productSchema.statics.deleteProduct = async function (id) {
  return await this.findOneAndDelete({ _id: id });
};
productSchema.statics.updateProduct = async function (id, data) {
  return await this.findByIdAndUpdate(id, data, { new: true });
};
productSchema.statics.getProductCart = async function (ids) {
  return await this.find({ _id: { $in: ids } });
};
productSchema.statics.searchProduct = async function (name) {
  return await this.find({ name: { $regex: name, $options: "i" } });
};
const Product = mongoose.model("Product", productSchema);

export default Product;
