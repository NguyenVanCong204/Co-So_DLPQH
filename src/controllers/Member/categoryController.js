import Category from "../../models/Category.js";

export const getCategory = async (req, res) => {
  try {
    const category = await Category.getCategory();
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
