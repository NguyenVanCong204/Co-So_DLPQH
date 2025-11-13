import Brand from "../../models/Brand.js";


export const getBrand = async (req, res) => {
  try {
    const brand = await Brand.getBrand();
    if (!brand || brand.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy brand" });
    }
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
export const createBrand = async (req, res) => {
  try {
    const data = req.body;
    const brand = await Brand.createBrand(data);
    return res.status(200).json({
      message: "Thêm mới Brand thành công !",
      data: brand,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};
