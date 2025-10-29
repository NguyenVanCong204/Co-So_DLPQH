import Brand from "../../models/Brand.js";

export const getBrand = async (req, res) => {
  try {
    const brand = await Brand.getBrand();
    return res.status(200).json({
      data: brand,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
