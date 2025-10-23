const CreateUserValidation = (data, file) => {
  const error = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  if (!data.name) {
    error.name = "Vui lòng nhập tên";
  }
  if (!data.email) {
    error.email = "Vui lòng nhập email";
  } else {
    if (!emailRegex.test(data.email)) {
      error.email = "Email không hợp lệ";
    }
  }
  if (!data.password) {
    error.password = "Vui lòng nhập password";
  }
  if (!data.phone) {
    error.phone = "Vui lòng nhập phone";
  } else {
    if (!phoneRegex.test(data.phone)) {
      error.phone = "Phone không hợp lệ";
    }
  }
  if (!data.address) {
    error.address = "Vui lòng nhập address";
  }
  if (!data.id_country) {
    error.country = "Vui lòng nhập country";
  }
  if (file.length == 0) {
    error.avatar = "Vui lòng upload avatar";
  } else {
    file.map((value, key) => {
      const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 1024 * 1024;
      if (!allowedFormats.includes(value.mimetype)) {
        error.avatar =
          "Định dạng file không hợp lệ . Chỉ chấp nhận JPEG , PNG hoặc GIF";
      }
      if (value.size > maxSize) {
        error.avatar =
          "Dung lượng file quá lớn. Vui lòng chọn file có dung lượng nhỏ hơn 1MB";
      }
    });
  }
  return error;
};
export default CreateUserValidation;
