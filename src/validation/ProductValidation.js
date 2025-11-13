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
  if (!data.qualty) {
    err.qualty = "Thiếu qualty";
  }
  if (data.qualty <= 0) {
    err.qualty = "Số lượng phải lớn hơn 0";
  }
  // if (file.length == 0) {
  //   err.image = "Vui lòng upload image";
  // }
  if (file.length > 3) {
    err.image = "Chỉ được chọn tối đa 3 file";
  } else {
    file.map((value, key) => {
      const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 1024 * 1024;
      if (!allowedFormats.includes(value.mimetype)) {
        err.image =
          "Định dạng file không hợp lệ . Chỉ chấp nhận JPEG , PNG hoặc GIF";
      }
      if (value.size > maxSize) {
        err.image =
          "Dung lượng file quá lớn. Vui lòng chọn file có dung lượng nhỏ hơn 1MB";
      }
    });
  }
  return err;
};
export default productValidation;
