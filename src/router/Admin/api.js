import express from "express";
import {
  createUser,
  upload,
  getUser,
  handleRefreshToken,
  checkLoginUser,
} from "../../controllers/Admin/userController.js";
import {
  createCountry,
  getCountry,
} from "../../controllers/Admin/countryController.js";
import { requireAuth, authorize } from "../../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/user/create", upload, createUser);
router.get("/getuser/:id", getUser);
router.post("/admin/token", handleRefreshToken);
router.post("/user/login", checkLoginUser);

router.post("/country/create", createCountry);
// router.get("/country/getall", requireAuth, authorize(1), getCountry);
router.get("/country/getall", requireAuth, authorize(1), getCountry);

export default router;
