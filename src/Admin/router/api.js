import express from "express";
const router = express.Router();
import {
  createUser,
  upload,
  getUser,
  handleRefreshToken,
  checkLoginUser,
} from "../controllers/userController.js";
import { createCountry, getCountry } from "../controllers/countryController.js";

router.post("/user/create", upload, createUser);
router.get("/getuser/:id", getUser);
router.post("/admin/token", handleRefreshToken);
router.post("/user/login", checkLoginUser);

router.post("/country/create", createCountry);
router.get("/country/getall", getCountry);

export default router;
