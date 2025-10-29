import Product from "../../models/Product.js";
import path from "path";
import multer from "multer";
import productValidation from "../../validation/ProductValidation.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/user");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "File không hợp lệ. Chỉ chấp nhận hình ảnh JPEG, PNG, GIF , ..."
      ),
      false
    );
  }
};
export const upload = multer({
  storage,
  fileFilter,
}).array("image", 3);
export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.getProductById(id);
    if (!product || product.length === 0) {
      return res.status(404).json({
        message: "Bạn chưa có Product nào !",
      });
    }
    return res.status(200).json({
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
export const getProduct = async (req, res) => {
  const product = await Product.getProduct();
  return res.status(200).json({
    data: product,
  });
};
export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;
    data.image = files ? files.map((f) => f.path) : [];
    const err = productValidation(data, files);
    if (Object.keys(err).length > 0) {
      return res.status(400).json({ errors: err });
    }
    data.image = JSON.stringify(data.image);
    const product = await Product.createProduct(data);
    return res.status(200).json({
      message: "Thêm product thành công !",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = Product.deleteProduct(id);
    return res.status(200).json({
      message: "Xóa Product thành công !",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
