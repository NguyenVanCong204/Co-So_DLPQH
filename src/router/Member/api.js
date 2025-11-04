import express from "express";
const router = express.Router();
import { getCountry } from "../../controllers/Member/countryController.js";
import {
  getProduct,
  createProduct,
  upload as uploadProduct,
  deleteProduct,
  getProductById,
  updateProduct,
  getProductCart,
  searchProduct,
} from "../../controllers/Member/productController.js";
import {
  getUser,
  upload,
  updateUser,
} from "../../controllers/Member/userController.js";
import { getCategory } from "../../controllers/Member/categoryController.js";
import { getBrand } from "../../controllers/Member/brandController.js";
import {
  getBlog,
  getBlogbyId,
} from "../../controllers/Member/blogController.js";
import {
  getComment,
  createComment,
} from "../../controllers/Member/commentController.js";
import { createHistory } from "../../controllers/Member/historyController.js";
import { requireAuth, authorize } from "../../middlewares/authMiddleware.js";

router.get("/product", getProduct);
router.get("/search/product", searchProduct);
router.get("/product/:id", getProductById);

router.get("/country", getCountry);

router.get("/category", getCategory);
router.get("/brand", getBrand);

router.get("/blog", getBlog);
router.get("/blog/:id", getBlogbyId);

router.get("/comment/:id", getComment);

router.post("/cart", getProductCart);

router.use(requireAuth, authorize(0));

router.get("/user/:id", getUser);
router.put("/user/:id", upload, updateUser);

router.post("/product", uploadProduct, createProduct);
router.delete("/product/:id", deleteProduct);
router.put("/product/:id", uploadProduct, updateProduct);

router.post("/comment", createComment);

router.post("/order", createHistory);

export default router;
