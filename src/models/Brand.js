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
brandSchema.statics.deleteBrand = async function (id) {
  return await this.delete({ _id : id });
};
brandSchema.statics.updateBrand = async function ( id, data ) {
  return await this.findByIdAndUpdate({_id: id}, data);
}
brandSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});
const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
