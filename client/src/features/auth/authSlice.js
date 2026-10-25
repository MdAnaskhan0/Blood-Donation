import { createSlice } from '@reduxjs/toolkit';

const load = () => {
  try {
    return JSON.parse(localStorage.getItem('auth')) || { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: load(),
  reducers: {
    setCredentials: (state, { payload }) => {
      state.token = payload.token;
      state.user = payload.user;
      localStorage.setItem('auth', JSON.stringify({ token: payload.token, user: payload.user }));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('auth');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectUser = (s) => s.auth.user;
export const selectToken = (s) => s.auth.token;
