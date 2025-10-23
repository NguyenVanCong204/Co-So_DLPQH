import express from "express";
const router = express.Router();
import { createUser, upload } from "../controllers/userController.js";

router.post("/user/create", upload, createUser);

export default router;
