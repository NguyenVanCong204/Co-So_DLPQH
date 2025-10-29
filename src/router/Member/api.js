import express from "express";
const router = express.Router();
import { getCountry } from "../../controllers/Member/countryController.js";
import {
  getProduct,
  createProduct,
  upload as uploadProduct,
  getProductById,
  deleteProduct,
} from "../../controllers/Member/productController.js";
import {
  getUser,
  upload,
  updateUser,
} from "../../controllers/Member/userController.js";
import { getCategory } from "../../controllers/Member/categoryController.js";
import { getBrand } from "../../controllers/Member/brandController.js";
import { requireAuth, authorize } from "../../middlewares/authMiddleware.js";

// router.use(requireAuth, authorize(0));

router.get("/user/:id", getUser);
router.put("/user/:id", upload, updateUser);

router.get("/country", getCountry);

router.post("/product", uploadProduct, createProduct);
router.get("/product", getProduct);
router.get("/product/:id", getProductById);
router.delete("/product/:id", deleteProduct);

router.get("/category", getCategory);

router.get("/brand", getBrand);

export default router;
