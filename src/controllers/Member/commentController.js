import Comment from "../../models/Comment.js";
import CreateCommentValidation from "../../validation/CreateCommentValidation.js";

export const getComment = async (req, res) => {
  try {
    const id = req.params.id;
    const comment = await Comment.getComment(id);
    return res.status(200).json({
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
export const createComment = async (req, res) => {
  try {
    const data = req.body;
    const err = await Comment.checkMemberComment(data.id_blog, data.id_user);
    if (Object.keys(err).length > 0) {
      return res.status(400).json({ error: err });
    }
    const errdata = CreateCommentValidation(data);
    if (Object.keys(errdata).length > 0) {
      return res.status(400).json({ errors: errdata });
    }
    const comment = await Comment.createComment(data);
    return res.status(200).json({
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
