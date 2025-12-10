import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import multer from "multer";
import CreateUserValidation from "../../validation/CreateUserValidation.js";
import Verification from "../../models/Verification.js";
import sendMail from "../../utils/sendMail.js";

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
  if (Object.keys(err).length > 0) {
    return res.status(400).json({ errors: err });
  }
  if (Object.keys(errEmail).length > 0) {
    return res.status(400).json({ error: errEmail });
  }

  data.avatar = avatarFiles ? avatarFiles.map((file) => file.path) : [];
  data.avatar = JSON.stringify(data.avatar);
  data.password = await bcrypt.hash(data.password, 10);
  data.level = parseInt(data.level);

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Verification.deleteOne({ email: data.email });

    await Verification.create({
      email: data.email,
      code: code,
      userData: data,
      expiresAt: expiresAt,
      lastSentAt: new Date()
    });

    const subject = "Mã xác thực đăng ký HKDN";
    const text = `Mã xác thực của bạn là: ${code}. Mã có hiệu lực trong 10 phút.`;
    const html = `<h3>Chào mừng bạn đến với HKDN!</h3><p>Mã xác thực của bạn là: <b>${code}</b></p><p>Mã này sẽ hết hạn sau 10 phút.</p>`;

    const sent = await sendMail(data.email, subject, text, html);

    if (!sent) {
      return res.status(500).json({ error: "Lỗi gửi email xác thực. Vui lòng thử lại." });
    }

    return res.status(200).json({
      message: "Mã xác thực đã được gửi đến email của bạn.",
      requireVerification: true,
      email: data.email
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Lỗi hệ thống khi tạo mã xác thực." });
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const record = await Verification.findOne({ email });

    if (!record) {
      return res.status(400).json({ error: "Mã xác thực không tồn tại hoặc đã hết hạn." });
    }

    if (record.code !== code) {
      return res.status(400).json({ error: "Mã xác thực không chính xác." });
    }

    const userData = record.userData;
    const user = await User.createUser(userData);

    await Verification.deleteOne({ email });

    const token = createJWT(user._id.toString(), user.level);
    const tokenReferesh = createJWTReferesh(user._id.toString(), user.level);
    const { level, password, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      message: "Đăng ký thành công!",
      user: userWithoutPassword,
      token: token,
      tokenReferesh: tokenReferesh,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Lỗi khi xác thực." });
  }
};

export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const record = await Verification.findOne({ email });

    if (!record) {
      return res.status(400).json({ error: "Không tìm thấy yêu cầu đăng ký. Vui lòng đăng ký lại." });
    }

    const now = new Date();
    const diff = (now - new Date(record.lastSentAt)) / 1000;
    if (diff < 60) {
      return res.status(429).json({ error: `Vui lòng đợi ${Math.ceil(60 - diff)}s để gửi lại mã.` });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    record.code = code;
    record.lastSentAt = now;
    record.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await record.save();

    const subject = "Gửi lại mã xác thực đăng ký HKDN";
    const text = `Mã xác thực mới của bạn là: ${code}`;
    const html = `<h3>HKDN E-commerce</h3><p>Mã xác thực mới là: <b>${code}</b></p>`;

    await sendMail(email, subject, text, html);

    return res.status(200).json({ message: "Đã gửi lại mã xác thực." });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
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
    const decoded = jwt.verify(token, "van-cong-referesh");
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
  if (!user) {
    return res.status(400).json({ message: "email hoặc pass sai" });
  }
  const token = createJWT(user._id.toString(), user.level);
  const tokenReferesh = createJWTReferesh(user._id.toString(), user.level);
  const { level, password, ...userWithoutPassword } = user.toObject();
  res.json({
    message: "Đăng nhập thành công",
    user: userWithoutPassword,
    token: token,
    tokenReferesh: tokenReferesh,
  });
};
