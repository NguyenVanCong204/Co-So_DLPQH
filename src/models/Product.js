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
const Product = mongoose.model("Product", productSchema);

export default Product;
