const productValidation = (data, file) => {
  const err = {};
  if (!data.id_category) {
    err.category = "Thiếu category";
  }
  if (!data.id_brand) {
    err.brand = "Thiếu brand";
  }
  if (!data.name) {
    err.category = "Thiếu name";
  }
  if (!data.price) {
    err.price = "Thiếu price";
  }
  if (!data.detail) {
    err.detail = "Thiếu detail";
  }
  if (!data.company) {
    err.company = "Thiếu company";
  }
  if (!data.qualty) {
    err.qualty = "Thiếu qualty";
  }
  if (data.qualty <= 0) {
    err.qualty = "Số lượng phải lớn hơn 0";
  }
  if (file.length == 0) {
    err.avatar = "Vui lòng upload avatar";
  }
  if (file.length > 3) {
    err.avatar = "Chỉ được chọn tối đa 3 file";
  } else {
    file.map((value, key) => {
      const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 1024 * 1024;
      if (!allowedFormats.includes(value.mimetype)) {
        err.avatar =
          "Định dạng file không hợp lệ . Chỉ chấp nhận JPEG , PNG hoặc GIF";
      }
      if (value.size > maxSize) {
        err.avatar =
          "Dung lượng file quá lớn. Vui lòng chọn file có dung lượng nhỏ hơn 1MB";
      }
    });
  }
  return err;
};
export default productValidation;
