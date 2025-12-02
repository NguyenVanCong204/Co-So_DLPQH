import Category from "../../models/Category.js";
import Product from "../../models/Product.js"
export const getCategory = async (req, res) => {
  try {
    const category = await Category.getCategory();
    if (!category || category.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy category" });
    }
    return res.status(200).json({
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const data = req.body;
    const category = await Category.createCategory(data);
    return res.status(200).json({
      message: "Thêm mới Category thành công !",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await Category.updateCategory(id, data);
    return res.status(200).json({
      message: "Cập nhật danh mục thành công !",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ id_category: id });

    if (product) {
      return res.status(400).json({
        message: "Danh mục đang được sử dụng, không thể xóa!",
      });
    }
    await Category.deleteCategory(id);

    return res.status(200).json({
      message: "Xóa danh mục thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};


