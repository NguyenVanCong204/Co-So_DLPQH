import { configureStore } from "@reduxjs/toolkit";
import CartSlider from "../features/cart/CartSlider";
import Cart from "../features/cart/Cart";
const store = configureStore({
  reducer: {
    cart: CartSlider,
    cartredux: Cart,
  },
});
export default store;
