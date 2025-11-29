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
      productErrors.push(`Sản phẩm ID ${value._id || value.id} thiếu name`);
    }
    if (!value.price) {
      productErrors.push(`Sản phẩm ID ${value._id || value.id} thiếu price`);
    }

    const qty = cart[value._id?.toString()] || cart[value.id];
    if (!qty) {
      productErrors.push(`Sản phẩm ID ${value._id || value.id} thiếu số lượng (qty)`);
    }
  });
  if (productErrors.length > 0) {
    err.products = productErrors;
  }
  return err;
};
export default CreateHistoryValidation;
