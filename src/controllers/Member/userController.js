import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import multer from "multer";
import User from "../../models/User.js";
import CreateUserValidation from "../../validation/CreateUserValidation.js";

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

export const createUser = async (req, res) => {
  const data = req.body;
  const avatarFiles = req.files;
  const err = CreateUserValidation(data, avatarFiles);
  const errEmail = await User.checkEmail(data.email);
  if (Object.keys(err).length > 0) {
    return res.status(400).json({ errors: err });
  }
  if (Object.keys(errEmail).length > 0) {
    return res.status(400).json({ errors: errEmail });
  }
  data.avatar = avatarFiles ? avatarFiles.map((file) => file.path) : [];
  data.avatar = JSON.stringify(data.avatar);
  data.password = await bcrypt.hash(data.password, 10);
  data.level = parseInt(data.level);
  const user = await User.createUser(data);
  res.json(user);
};
