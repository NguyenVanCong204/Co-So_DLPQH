import mongoose from "mongoose";
import Comment from "./Comment.js";
import mongooseDelete from "mongoose-delete";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true },
    image: String,
    description: String,
    content: { type: String },
  },
  { timestamps: true }
);

blogSchema.statics.createBlog = async function (data) {
  return await this.create(data);
};
blogSchema.statics.getBlog = async function () {
  return await this.find();
};
blogSchema.statics.getBlogbyId = async function (id) {
  return await this.findById(id);
};
blogSchema.statics.updateBlog = async function (id, data) {
  return await this.findByIdAndUpdate(id, data, { new: true });
};
blogSchema.statics.deleteBlog = async function (id) {
  const deleteBlog = await this.delete({ _id: id });
  if (!deleteBlog) return;
  return await Comment.delete({ id_blog: id });
};
blogSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});
const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
