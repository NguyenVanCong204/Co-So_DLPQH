import express from "express";
import {
  upload,
  createUser,
  checkLoginUser,
  handleRefreshToken,
} from "../../controllers/Auth/authController.js";

const router = express.Router();

//Login - register
router.post("/register", upload, createUser);
router.post("/refresh-token", handleRefreshToken);
router.post("/login", checkLoginUser);

export default router;
