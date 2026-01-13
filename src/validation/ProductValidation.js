const productValidation = (data, file) => {
  const err = {};
  if (!data.id_category) {
    err.category = "Thiếu loại sản phẩm";
  }
  if (!data.id_brand) {
    err.brand = "Thiếu thương hiệu";
  }
  if (!data.name) {
    err.name = "Thiếu tên sản phẩm";
  }
  if (data.price === undefined || data.price === "") {
    err.price = "Thiếu giá sản phẩm";
  }
  if (!data.detail) {
    err.detail = "Thiếu chi tiết sản phẩm";
  }
  if (data.quantity === undefined || data.quantity === "") {
    err.quantity = "Thiếu số lượng";
  }
  if (parseInt(data.quantity) < 0) {
    err.quantity = "Số lượng không được âm";
  }
  
  if (file.length > 3) {
    err.image = "Chỉ được chọn tối đa 3 file";
  } else if (file.length > 0) {
    file.map((value, key) => {
      const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 1024 * 1024;
      if (!allowedFormats.includes(value.mimetype)) {
        err.image =
          "Định dạng file không hợp lệ. Chỉ chấp nhận JPEG, PNG hoặc GIF";
      }
      if (value.size > maxSize) {
        err.image =
          "Dung lượng file quá lớn. Vui lòng chọn file nhỏ hơn 1MB";
      }
    });
  }
  return err;
};
export default productValidation;
