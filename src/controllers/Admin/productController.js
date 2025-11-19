import Product from "../../models/Product.js";
import path from "path";
import multer from "multer";
import productValidation from "../../validation/ProductValidation.js";
import {
  UpdateProductValidation,
  checkFile,
} from "../../validation/UpdateProductValidation.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/product");
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

export const getProduct = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    const product = await Product.getProduct(page, limit);
    if (!product.data || product.data.length === 0) {
      return res.status(404).json({
        message: "Bạn chưa có Product nào !",
      });
    }
    return res.status(200).json({
      page,
      limit,
      total: product.total,
      totalPages: Math.ceil(product.total / limit),
      data: product.data
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;
    data.image = files ? files.map((f) => f.path) : [];
    const err = productValidation(data, files);
    const [errBrand, errCategory] = await Promise.all([
      Product.checkBrand(data.id_brand),
      Product.checkCategory(data.id_category),
    ]);
    if (Object.keys(err).length > 0) {
      return res.status(400).json({
        errors: err,
      });
    }
    const notFoundErrors = { ...errBrand, ...errCategory };
    if (Object.keys(notFoundErrors).length > 0) {
      return res.status(404).json({ errors: notFoundErrors });
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
export const deleteMany = async (req, res) => {
  try {
    const {ids} = req.body;
    await Product.deleteMany(ids);
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
export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.getProductById(id);
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
export const updateProduct = async (req, res) => {
  const id = req.params.id;
  const avatarproduct = await Product.getProductById(id);
  const avatarold = JSON.parse(avatarproduct.image);
  const data = req.body;
  const files = req.files ? req.files : [];
  const err = UpdateProductValidation(data, files);
  const [errBrand, errCategory] = await Promise.all([
    Product.checkBrand(data.id_brand),
    Product.checkCategory(data.id_category),
  ]);
  const notFoundErrors = { ...errBrand, ...errCategory };
  if (Object.keys(notFoundErrors).length > 0) {
    return res.status(404).json({ errors: notFoundErrors });
  }
  if (Object.keys(err).length > 0) {
    return res.status(400).json({ errors: err });
  } else {
    if (files && files.length > 0) {
      if (data.imageDelete) {
        const avatarnew1 = avatarold.filter(
          (f) => !data.imageDelete.includes(f)
        );
        const avatarnew2 = files ? files.map((f) => f.path) : [];
        const avatarnew = [...avatarnew1, ...avatarnew2];
        const err = checkFile(avatarnew);
        if (Object.keys(err).length > 0) {
          return res.status(400).json({ errors: err });
        }
        data.image = JSON.stringify(avatarnew);
        const { imageDelete, ...productnew } = data;
        await Product.updateProduct(id, productnew);
        return res
          .status(200)
          .json({ message: "Update product thành công khi gửi files" });
      } else {
        const avatarnew1 = files ? files.map((f) => f.path) : [];
        const avatarnew = [...avatarnew1, ...avatarold];
        const err = checkFile(avatarnew);
        if (Object.keys(err).length > 0) {
          return res.status(400).json({ errors: err });
        }
        data.image = JSON.stringify(avatarnew);
        await Product.updateProduct(id, data);
        return res
          .status(200)
          .json({ message: "Update product thành công khi gửi files" });
      }
    } else {
      if (data.imageDelete) {
        const avatarnew = avatarold.filter(
          (f) => !data.imageDelete.includes(f)
        );
        const err = checkFile(avatarnew);
        if (Object.keys(err).length > 0) {
          return res.status(400).json({ errors: err });
        }
        data.image = JSON.stringify(avatarnew);
        const { imageDelete, ...productnew } = data;
        await Product.updateProduct(id, productnew);
        return res.status(200).json({ message: "Update product thành công" });
      } else {
        const { imageDelete, ...productnew } = data;
        await Product.updateProduct(id, productnew);
        return res.status(200).json({ message: "Update product thành công" });
      }
    }
  }
};
export const getProductCart = async (req, res) => {
  try {
    const data = req.body || {};
    const ids = Object.keys(data);
    const product = await Product.getProductCart(ids);
    if (!product || product.length === 0) {
      return res.status(200).json({
        message: "Giỏ hàng trống",
      });
    }
    const result = product.map((p) => ({
      ...p.toObject(),
      qty: data[p._id.toString()] || 0,
    }));
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
export const searchProduct = async (req, res) => {
  try {
    const name = req.query.name || "";
    const product = await Product.searchProduct(name);
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

export const getProductByCategory = async (req, res) => {
  try {
    const id_category = req.params.id_category;
    const product = await Product.getProductByCategory(id_category);
    
    if (!product || product.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy sản phẩm nào thuộc danh mục này",
        data: [], 
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