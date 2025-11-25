import express from "express";
import {
  getUser,
  updateUser,
  upload,
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
import {
  getProduct,
  createProduct,
  upload as uploadProduct,
  deleteProduct,
  updateProduct,
  deleteMany,
  trash,
  countTrashProduct,
  restore,
  forceDelete,
} from "../../controllers/Admin/productController.js";
import { createBrand, getBrand } from "../../controllers/Admin/brandController.js";
import { createCategory, getCategory } from "../../controllers/Admin/categoryController.js";
import { requireAuth, authorize } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(requireAuth, authorize(1));

router.get("/country", getCountry);
router.get("/brand", getBrand);
router.post("/brand", createBrand);
router.post("/category", createCategory);
router.get("/category", getCategory);

router.get("/product", getProduct);
router.post("/product", uploadProduct, createProduct);
router.delete("/product/delete/:id", deleteProduct);
router.delete("/product/delete-many", deleteMany);
router.put("/product/update/:id", uploadProduct, updateProduct);
router.get("/trash-product", trash);

router.get("/trash-product/count", countTrashProduct);
router.patch("/trash-product/restore/:id", restore);
router.delete("/trash-product/force-delete/:id", forceDelete);

router.put("/user/:id", upload, updateUser);
router.get("/user/:id", getUser);

router.post("/country", createCountry);
router.delete("/country/:id", deleteCountry);
router.put("/country/:id", updateCountry);

router.post("/blog", uploadBlog, createBlog);
router.get("/blog", getBlog);
router.get("/blog/:id", getBlogbyId);
router.put("/blog/:id", uploadBlog, updateBlog);
router.delete("/blog/:id", deleteBlog);

export default router;
