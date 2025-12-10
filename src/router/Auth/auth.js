import express from "express";
import {
  upload,
  createUser,
  checkLoginUser,
  handleRefreshToken,
  verifyCode,
  resendCode
} from "../../controllers/Auth/authController.js";

const router = express.Router();

router.post("/register", upload, createUser);
router.post("/verify", verifyCode);
router.post("/resend", resendCode);
router.post("/refresh-token", handleRefreshToken);
router.post("/login", checkLoginUser);

export default router;
