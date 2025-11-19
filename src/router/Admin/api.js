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
  getProductById,
  updateProduct,
  getProductCart,
  searchProduct,
  getProductByCategory,
  deleteMany,
} from "../../controllers/Admin/productController.js";
import { createBrand, getBrand } from "../../controllers/Admin/brandController.js";
import { createCategory, getCategory } from "../../controllers/Admin/categoryController.js";
import { requireAuth, authorize } from "../../middlewares/authMiddleware.js";

const router = express.Router();

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

router.use(requireAuth, authorize(1));

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
