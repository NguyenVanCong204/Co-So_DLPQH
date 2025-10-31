const CreateCommentValidation = (data) => {
  const err = {};
  if (!data.id_blog) {
    err.blog = "Thiếu id_blog";
  }
  if (!data.id_user) {
    err.user = "Thiếu id_user";
  }
  if (!data.name_user) {
    err.nameuser = "Thiếu name user";
  }
  if (!data.level) {
    err.level = "Thiếu level";
  }
  if (!data.comment) {
    err.comment = "Vui lòng nhập comment";
  }
  if (!data.image_user) {
    err.image = "Thiếu image_user";
  }
  return err;
};
export default CreateCommentValidation;
