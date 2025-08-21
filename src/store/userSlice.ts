import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the User object for the Redux state
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'seller' | 'buyer';
  token: string;
  joinedDate: string;
}

// Define the shape of the initial state
interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    loginFailure(state) {
      state.isLoading = false;
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    // ADDED: Reducer to handle profile updates
    updateProfile(state, action: PayloadAction<{ name: string; email: string }>) {
      if (state.currentUser) {
        state.currentUser.name = action.payload.name;
        state.currentUser.email = action.payload.email;
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;
