import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: String,
});
const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
