import mongoose from "mongoose";

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
});
productSchema.statics.createProduct = async function (data) {
  return await this.create(data);
};
productSchema.statics.getProduct = async function () {
  return await this.find();
};
productSchema.statics.getProductById = async function (userId) {
  return await this.find({ id_user: userId });
};
productSchema.statics.deleteProduct = async function (id) {
  return await this.findOneAndDelete({ _id: id });
};
const Product = mongoose.model("Product", productSchema);

export default Product;
