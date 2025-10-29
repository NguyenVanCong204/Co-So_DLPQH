import Category from "../../models/Category.js";

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
