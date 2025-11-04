const CreateHistoryValidation = (user, products, cart) => {
  const err = {};
  if (!user._id) {
    err.id_user = "Thiếu id_user";
  }
  if (!cart || Object.keys(cart).length == 0) {
    err.cart = "Giỏ hàng trống";
  }
  const productErrors = [];
  products.map((value, index) => {
    if (!value.name) {
      productErrors.push(`Sản phẩm ID ${value.id} thiếu name`);
    }
    if (!value.price) {
      productErrors.push(`Sản phẩm ID ${value.id} thiếu price`);
    }

    if (!cart[value.id]) {
      productErrors.push(`Sản phẩm ID ${p.id} thiếu số lượng (qty)`);
    }
  });
  if (productErrors.length > 0) {
    err.products = productErrors;
  }
  return err;
};
export default CreateHistoryValidation;
