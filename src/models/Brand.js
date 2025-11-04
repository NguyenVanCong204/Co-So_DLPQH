import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên thương hiệu là bắt buộc"],
    },
  },
  { timestamps: true }
);

brandSchema.statics.createBrand = async function (data) {
  return await this.create(data);
};
brandSchema.statics.getBrand = async function () {
  return await this.find();
};
brandSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});
const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
