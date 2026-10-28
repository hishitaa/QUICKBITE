import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem('qb_user'));
  } catch {
    return null;
  }
})();

const authCall = (name, path) =>
  createAsyncThunk(`auth/${name}`, async (body, { rejectWithValue }) => {
    try {
      return await api(path, { method: 'POST', body, token: '' });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  });

export const login = authCall('login', '/auth/login');
export const register = authCall('register', '/auth/register');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: saved,
    token: localStorage.getItem('qb_token'),
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('qb_token');
      localStorage.removeItem('qb_user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    for (const thunk of [login, register]) {
      builder
        .addCase(thunk.pending, (s) => {
          s.status = 'loading';
          s.error = null;
        })
        .addCase(thunk.fulfilled, (s, { payload }) => {
          s.status = 'idle';
          s.user = payload.user;
          s.token = payload.token;
          localStorage.setItem('qb_token', payload.token);
          localStorage.setItem('qb_user', JSON.stringify(payload.user));
        })
        .addCase(thunk.rejected, (s, { payload }) => {
          s.status = 'idle';
          s.error = payload || 'Something went wrong';
        });
    }
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
