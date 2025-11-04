import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import multer from "multer";
import CreateUserValidation from "../../validation/CreateUserValidation.js";

const RefreshTokens = [];
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
  const errCountry = await User.checkCountry(data.id_country);
  if (Object.keys(err).length > 0) {
    return res.status(400).json({ errors: err });
  }
  if (Object.keys(errEmail).length > 0) {
    return res.status(400).json({ error: errEmail });
  }
  if (Object.keys(errCountry).length > 0) {
    return res.status(400).json({ error: errCountry });
  }
  data.avatar = avatarFiles ? avatarFiles.map((file) => file.path) : [];
  data.avatar = JSON.stringify(data.avatar);
  data.password = await bcrypt.hash(data.password, 10);
  data.level = parseInt(data.level);
  const user = await User.createUser(data);
  res.json(user);
};
function createJWT(id, level) {
  const token = jwt.sign({ id, level }, "van-cong", { expiresIn: "5h" });
  return token;
}
function createJWTReferesh(id, level) {
  const tokenRefresh = jwt.sign({ id, level }, "van-cong-referesh");
  RefreshTokens.push(tokenRefresh);
  return tokenRefresh;
}
export const handleRefreshToken = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json(401).json({ error: "Unauthorized - No token provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized1" });
  }
  if (!RefreshTokens.includes(token)) {
    return res.status(403).json({ error: "Unauthorized2" });
  }
  try {
    const decoded = jwt.verify(token, "van-cong-referesh"); //giải mã ra lại ban đầu
    const newAccessToken = createJWT(decoded.id, decoded.level);
    res.json({ token: newAccessToken });
  } catch (error) {
    console.error("Refresh token verification failed:", error);
    return res.status(401).json({ error: "Unauthorized3" });
  }
};
export const checkLoginUser = async (req, res) => {
  const data = req.body;
  const user = await User.checkLoginUser(data);
  const token = createJWT(data.id, data.level);
  const tokenReferesh = createJWTReferesh(data.id, data.level);
  if (!user) {
    res.status(400).json({ message: "email hoặc pass sai" });
  }
  const { level, password, ...userWithoutPassword } = user.toObject();
  res.json({
    message: "Đăng nhập thành công",
    user: userWithoutPassword,
    token: token,
    tokenReferesh: tokenReferesh,
  });
};
