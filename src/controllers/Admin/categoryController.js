import Category from "../../models/Category.js";

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
