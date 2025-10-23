import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  image: String,
  description: String,
  content: { type: String },
});
const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
