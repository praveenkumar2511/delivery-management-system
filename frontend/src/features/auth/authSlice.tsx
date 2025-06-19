import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from './authService';
import { toast } from 'sonner';

// ✅ Define the auth state type
interface AuthState {
  user: UserCredentials | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

interface UserCredentials {
  email: string;
  password: string;
}

// ✅ Initialize user from localStorage with proper typing
const user: UserCredentials | null = localStorage.getItem('user') 
  ? JSON.parse(localStorage.getItem('user') as string) 
  : null;

const initialState: AuthState = {
  user: user || null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  
};

// ✅ Fix createAsyncThunk error handling
export const login = createAsyncThunk<UserCredentials, UserCredentials, { rejectValue: string }>(
  'auth/login',
  async (user, thunkAPI) => {
    try {
      return await authService.login(user);
    } catch (error: any) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message || 'Something went wrong';

      return thunkAPI.rejectWithValue(message); // ✅ Properly types the rejected value
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.user = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
    logout: (state) => {
      localStorage.removeItem('user');
      window.location.replace('/login');
      state.user = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      toast.success("Log out successful!"); 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<UserCredentials>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        toast.success("Login successful!"); 
      })
      .addCase(login.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.user = null;
        state.message = action.payload || 'Something went wrong'; // ✅ Ensure it's always a string
      });
  }
});

export const { reset, logout } = authSlice.actions;

export default authSlice.reducer;
