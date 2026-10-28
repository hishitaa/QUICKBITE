import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';
import cart from './cartSlice';

export const store = configureStore({ reducer: { auth, cart } });

// Persist the cart so it survives a refresh
store.subscribe(() => {
  try {
    localStorage.setItem('qb_cart', JSON.stringify(store.getState().cart.items));
  } catch {
    /* storage unavailable */
  }
});
