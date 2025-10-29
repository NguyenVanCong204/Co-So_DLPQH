import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên thương hiệu là bắt buộc"],
  },
});

brandSchema.statics.createBrand = async function (data) {
  return await this.create(data);
};
brandSchema.statics.getBrand = async function () {
  return await this.find();
};

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
