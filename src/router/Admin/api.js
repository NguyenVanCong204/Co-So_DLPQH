import express from "express";
import {
  createUser,
  upload,
  getUser,
  handleRefreshToken,
  checkLoginUser,
  updateUser,
} from "../../controllers/Admin/userController.js";
import {
  createCountry,
  getCountry,
  deleteCountry,
  updateCountry,
} from "../../controllers/Admin/countryController.js";
import {
  createBlog,
  upload as uploadBlog,
  getBlog,
  getBlogbyId,
  updateBlog,
  deleteBlog,
} from "../../controllers/Admin/blogController.js";
import { requireAuth, authorize } from "../../middlewares/authMiddleware.js";

const router = express.Router();

//Login - register
router.post("/user", upload, createUser);
router.post("/refershtoken", handleRefreshToken);
router.post("/login", checkLoginUser);
router.get("/country", getCountry);

//middleware
router.use(requireAuth, authorize(1));

//user
router.put("/user/:id", upload, updateUser);
router.get("/user/:id", getUser);

//country
router.post("/country", requireAuth, authorize(1), createCountry);
router.delete("/country/:id", requireAuth, authorize(1), deleteCountry);
router.put("/country/:id", requireAuth, authorize(1), updateCountry);

//blog
router.post("/blog", requireAuth, authorize(1), uploadBlog, createBlog);
router.get("/blog", getBlog);
router.get("/blog/:id", getBlogbyId);
router.put("/blog/:id", requireAuth, authorize(1), uploadBlog, updateBlog);
router.delete("/blog/:id", requireAuth, authorize(1), deleteBlog);

export default router;
