import Brand from "../../models/Brand.js";
import Product from "../../models/Product.js"

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
export const updateBrand = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await Brand.updateBrand(id, data);
    return res.status(200).json({
      message: "Cập nhật thương hiệu thành công !",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server !",
      error: error.message,
    });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ id_brand: id });

    if (product) {
      return res.status(400).json({
        message: "Thương hiệu đang được sử dụng, không thể xóa!",
      });
    }
    await Brand.deleteBrand(id);

    return res.status(200).json({
      message: "Xóa thương hiệu thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};
