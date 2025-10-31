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
  id_comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
});
commentSchema.statics.createComment = async function (data) {
  return await this.create(data);
};
commentSchema.statics.checkMemberComment = async function (id_blog, id_user) {
  const err = {};
  try {
    const check = await this.countDocuments({
      id_blog: id_blog,
      id_user: id_user,
    });
    if (check > 3) {
      err.check = "Bạn đã comment quá nhiều trong bài viết này";
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra comment:", error.message);
    err.system = "Lỗi hệ thống khi kiểm tra comment";
  }
  return err;
};
commentSchema.statics.getComment = async function (id) {
  return await this.find({ id_blog: id });
};
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
