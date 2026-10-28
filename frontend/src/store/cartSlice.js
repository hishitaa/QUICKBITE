import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: JSON.parse(localStorage.getItem('qb_cart') || '[]') },
  reducers: {
    addItem(state, { payload }) {
      const found = state.items.find((i) => i.id === payload._id);
      if (found) found.qty += 1;
      else state.items.push({ id: payload._id, name: payload.name, price: payload.price, emoji: payload.emoji, qty: 1 });
    },
    setQty(state, { payload: { id, qty } }) {
      const item = state.items.find((i) => i.id === id);
      if (item) item.qty = Math.max(1, Math.min(20, qty));
    },
    removeItem(state, { payload }) {
      state.items = state.items.filter((i) => i.id !== payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const selectCartCount = (s) => s.cart.items.reduce((n, i) => n + i.qty, 0);
export const selectCartTotal = (s) => s.cart.items.reduce((n, i) => n + i.qty * i.price, 0);

export const { addItem, setQty, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
