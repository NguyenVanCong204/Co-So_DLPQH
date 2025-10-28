const CreateBlogValidation = (data, file) => {
  const err = {};
  const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
  const maxSize = 1024 * 1024;
  if (!data.title) {
    err.title = "Vui lòng nhập title";
  }
  if (!data.description) {
    err.description = "Vui lòng nhập description";
  }
  if (!data.content) {
    err.content = "Vui lòng nhập content";
  }
  if (!file) {
    err.image = "Vui lòng chọn image";
  } else {
    if (!allowedFormats.includes(file.mimetype)) {
      err.image =
        "Định dạng file không hợp lệ . Chỉ chấp nhận JPEG , PNG hoặc GIF";
    }
    if (file.size > maxSize) {
      err.image =
        "Dung lượng file quá lớn. Vui lòng chọn file có dung lượng nhỏ hơn 1MB";
    }
  }

  return err;
};
export default CreateBlogValidation;
