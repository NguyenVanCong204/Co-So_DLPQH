import { createSlice } from '@reduxjs/toolkit';

const calculateTotal = (items) => Object.values(items).reduce((sum, qty) => sum + (Number(qty) || 0), 0);

const cartItems = JSON.parse(localStorage.getItem('cart')) || {};
const cartTotal = calculateTotal(cartItems);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: cartItems,
        total: cartTotal,
        search: '',
    },
    reducers: {
        setCartDetails: (state, action) => {
            state.items = action.payload;
            state.total = calculateTotal(state.items);
            localStorage.setItem('cart', JSON.stringify(state.items));
            localStorage.setItem('total', JSON.stringify(state.total));
        },

        addQuantityCart: (state, action) => {
            const id = action.payload;
            state.items[id] = (state.items[id] || 0) + 1;
            state.total = calculateTotal(state.items);
            localStorage.setItem('cart', JSON.stringify(state.items));
            localStorage.setItem('total', JSON.stringify(state.total));
        },

        removeQuantityCart: (state, action) => {
            const id = action.payload;
            if (state.items[id] > 1) {
                state.items[id] -= 1;
            } else {
                delete state.items[id];
            }
            state.total = calculateTotal(state.items);
            localStorage.setItem('cart', JSON.stringify(state.items));
            localStorage.setItem('total', JSON.stringify(state.total));
        },

        removeFromCart: (state, action) => {
            const id = action.payload;
            delete state.items[id];
            state.total = calculateTotal(state.items);
            localStorage.setItem('cart', JSON.stringify(state.items));
            localStorage.setItem('total', JSON.stringify(state.total));
        },

        setSearch: (state, action) => {
            state.search = action.payload;
        },

        resetCart: (state) => {
            state.items = {};
            state.total = 0;
            state.search = '';
            localStorage.removeItem('cart');
            localStorage.removeItem('total');
        },

        addToCart: (state, action) => {
            let id, qtyToAdd;
            if (typeof action.payload === 'object' && action.payload && action.payload.id) {
                id = action.payload.id;
                qtyToAdd = action.payload.qty || 1;
            } else if (typeof action.payload === 'number') {
                state.total += action.payload;
                localStorage.setItem('total', JSON.stringify(state.total));
                return;
            } else {
                id = action.payload;
                qtyToAdd = 1;
            }

            state.items[id] = (state.items[id] || 0) + Number(qtyToAdd);
            state.total = calculateTotal(state.items);

            localStorage.setItem('cart', JSON.stringify(state.items));
            localStorage.setItem('total', JSON.stringify(state.total));
        },
    },
});

export const { setCartDetails, addQuantityCart, removeQuantityCart, removeFromCart, setSearch, resetCart, addToCart } =
    cartSlice.actions;

export default cartSlice.reducer;
