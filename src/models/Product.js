import mongoose from "mongoose";
import Category from "./Category.js";
import Brand from "./Brand.js";
import User from "./User.js";
import mongooseDelete from "mongoose-delete";

const productSchema = new mongoose.Schema(
  {
    id_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    id_brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    name: String,
    image: String,
    price: Number,
    status: Number,
    sale: Number,
    detail: String,
    qualty: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
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
productSchema.statics.createProduct = async function (data) {
  return await this.create(data);
};
productSchema.statics.getProduct = async function () {
  return await this.find()
    .populate('id_brand', 'name')      
    .populate('id_category', 'name');
};
productSchema.statics.getProductById = async function (id) {
  return await this.findOne({ _id: id });
};
productSchema.statics.deleteProduct = async function (id) {
  return await this.delete({ _id: id });
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

productSchema.statics.getProductByCategory = async function (id_category) {
  return await this.find({ id_category: id_category });
};

productSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

const Product = mongoose.model("Product", productSchema);

export default Product;
