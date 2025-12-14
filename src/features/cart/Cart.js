import { createSlice } from '@reduxjs/toolkit';
import MemberCartContext from '../../Context/MemberCartContext';

const cartStorage = JSON.parse(localStorage.getItem('cart')) || {};
const Cart = createSlice({
    name: 'cartredux',
    initialState: cartStorage,
    reducers: {
        removeFromCart: (state, action) => {
            const id = action.payload;
            delete state[id];
            localStorage.setItem('cart', JSON.stringify(state));
        },

        addQuantityCart: (state, action) => {
            const id = action.payload;
            if (state[id] != 0) {
                state[id] += 1;
            } else {
                state[id] = 1;
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },

        removeQuantityCart: (state, action) => {
            const id = action.payload;
            if (state[id] && state[id] > 0) {
                state[id] -= 1;
            }
            localStorage.setItem('cart', JSON.stringify(state));
        },

        resetCartRedux: (state) => {
            state = {};
            localStorage.removeItem('cart');
            return state;
        },

        setCartDetails: (state, action) => {
            const newCart = action.payload;
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        },
    },
});
export const { addQuantityCart, removeFromCart, removeQuantityCart, resetCartRedux, setCartDetails } = Cart.actions;
export default Cart.reducer;
