import Country from "../../models/Country.js";

export const createCountry = async (req, res) => {
  const data = req.body;
  const country = await Country.createCountry(data);
  return res.json(country);
};
export const getCountry = async (req, res) => {
  const country = await Country.getCountry();
  return res.json(country);
};
export const deleteCountry = async (req, res) => {
  try {
    const idCountry = req.params.id;
    const country = await Country.deleteCountry(idCountry);
    return res.status(200).json({
      message: "Xóa country thành công !",
      data: country,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};
export const updateCountry = async (req, res) => {
  try {
    const data = req.body;
    const idCountry = req.params.id;
    const country = await Country.updateCountry(idCountry, data);
    if (!country) {
      return res.status(404).json({
        message: "Country không tồn tại !",
      });
    }
    return res.status(200).json({
      message: "Update country thành công !",
      data: country,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};
