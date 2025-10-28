import mongoose from "mongoose";
import Comment from "./Comment.js";

const blogSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  image: String,
  description: String,
  content: { type: String },
});

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
blogSchema.pre("findOneAndDelete", async function (next) {
  const blogId = this.getQuery()["_id"];
  await Comment.deleteMany({ id_blog: blogId });
  next();
});
blogSchema.statics.deleteBlog = async function (id) {
  return await this.findOneAndDelete({ _id: id });
};
const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
