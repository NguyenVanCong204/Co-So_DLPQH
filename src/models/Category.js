import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
    },
  },
  { timestamps: true }
);

categorySchema.statics.createCategory = async function (data) {
  return await this.create(data);
};
categorySchema.statics.getCategory = async function () {
  return await this.find();
};
categorySchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});
const Category = mongoose.model("Category", categorySchema);

export default Category;
