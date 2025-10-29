import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import path from "path";
import multer from "multer";
import UpdateUserValidation from "../../validation/UpdateUserValidation.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/user");
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
}).array("avatar", 3);
export const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.getUser(id);
  const { level, password, ...userWithoutPassword } = user.toObject();
  res.json(userWithoutPassword);
};
export const updateUser = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.params.id;
    const avatarFiles = req.files;
    const err = UpdateUserValidation(data, avatarFiles);
    if (Object.keys(err).length > 0) {
      return res.status(400).json({
        errors: err,
      });
    }
    data.avatar = avatarFiles ? avatarFiles.map((file) => file.path) : [];
    data.avatar = JSON.stringify(data.avatar);
    data.password = await bcrypt.hash(data.password, 10);
    const user = await User.updateUser(userId, data);
    const { level, password, ...userWithoutPassword } = user.toObject();
    return res.status(200).json({
      message: "Update User thành công",
      data: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
