import express from "express";
const router = express.Router();
import { createUser, upload } from "../../controllers/Member/userController.js";
import { requireAuth, authorize } from "../../middlewares/authMiddleware.js";

router.post("/user/create", upload, createUser);

export default router;
