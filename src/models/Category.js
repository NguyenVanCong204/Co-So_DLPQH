import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên sản phẩm là bắt buộc"],
  },
});

categorySchema.statics.createCategory = async function (data) {
  return await this.create(data);
};
categorySchema.statics.getCategory = async function () {
  return await this.find();
};
const Category = mongoose.model("Category", categorySchema);

export default Category;
