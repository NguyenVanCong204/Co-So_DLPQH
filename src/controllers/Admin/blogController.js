import Blog from "../../models/Blog.js";
import multer from "multer";
import path from "path";
import CreateBlogValidation from "../../validation/CreateBlogValidation.js";
import { error } from "console";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/blog");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "File không hợp lệ. Chỉ chấp nhận hình ảnh JPEG, PNG, GIF , ..."
      ),
      false
    );
  }
};
export const upload = multer({
  storage,
  fileFilter,
}).single("image");

export const createBlog = async (req, res) => {
  try {
    const data = req.body;
    const avatarFile = req.file;
    const error = CreateBlogValidation(data, avatarFile);
    if (Object.keys(error).length > 0) {
      return res.status(400).json({
        errors: error,
      });
    }
    data.image = avatarFile ? avatarFile.path : [];
    const blog = await Blog.createBlog(data);
    return res.status(200).json({
      message: "Tạo mới Blog thành công",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi Server !",
      error: error.message,
    });
  }
};
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.getBlog();
    if (!blog) {
      return res.status(404).json({
        message: "Không tìm thấy Blog !",
      });
    }
    return res.status(200).json({
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
export const getBlogbyId = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.getBlogbyId(id);
    if (!blog) {
      return res.status(404).json({
        message: "Không tìm thấy Blog !",
      });
    }
    return res.status(200).json({
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
export const updateBlog = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const avatarFile = req.file;
    const err = CreateBlogValidation(data, avatarFile);
    if (Object.keys(err).length > 0) {
      return res.status(400).json({
        error: err,
      });
    }
    data.image = avatarFile ? avatarFile.path : [];
    const blog = await Blog.updateBlog(id, data);
    return res.status(200).json({
      message: "Update Blog thành công",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.deleteBlog(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Không tìm thấy Blog để xóa !",
      });
    }
    return res.status(200).json({
      message: "Xóa Blog thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
