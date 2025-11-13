import { createSlice } from "@reduxjs/toolkit";

const cartStorage = JSON.parse(localStorage.getItem("total")) || 0;
const CartSlider = createSlice({
  name: "cart",
  initialState: {
    value: cartStorage,
    search: "",
  },
  reducers: {
    addToCart: (state, action) => {
      state.value += action.payload;
      localStorage.setItem("total", JSON.stringify(state.value));
    },

    Search: (state, action) => {
      state.search = action.payload;
    },

    resetCartSlider: (state) => {
      state.value = 0;
      localStorage.removeItem("total");
    },
  },
});
export const { addToCart, Search, resetCartSlider } = CartSlider.actions;
export default CartSlider.reducer;
