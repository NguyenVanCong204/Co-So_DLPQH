import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  id_blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    require: true,
  },
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  name_user: String,
  level: { type: Number },
  comment: String,
  image_user: { type: String },
  id_comment: Number,
});
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
