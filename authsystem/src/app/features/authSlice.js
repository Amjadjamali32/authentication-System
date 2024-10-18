import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Register User
export const registerUser = createAsyncThunk('auth/register', async (credentials, thunkAPI) => {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/users/auth/register', credentials);
    return {
      message: response.data.message,
      user: response.data,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// login User 
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/users/auth/login', credentials);
    console.log(response);
    const token = response.data.data.accessToken;
    // console.log(token);
    localStorage.setItem('token', token);

    return {
      user: response.data.data.user, 
      token: response.data.data.accessToken, 
      message: response.data.data.message
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Login failed!' });
  }
});

// Fetch Profile 
export const fetchUserProfile = createAsyncThunk('auth/fetchProfile', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/api/v1/users/current-user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("From Profile: " , response.data.data);
    
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.data);
  }
});

// Update User Profile
export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put('http://localhost:3000/api/v1/users/update-profile', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data.user;  
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);  
  }
});

// Request Password Reset
export const requestPasswordReset = createAsyncThunk('auth/requestPasswordReset', async (email, thunkAPI) => {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/users/auth/forgot-password', { email });
    return response.data.data;  
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'), 
    user: null,
    profile: null,
    loading: false,
    error: null,
    role: null,
    isAuthenticated: !!localStorage.getItem('token')
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.profile = null;
      state.error = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;  
        state.token = action.payload.token;
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload|| "Error in Login!";
        state.isAuthenticated = false;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      // Handle updateUserProfile
      builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload; 
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


      // Add the new thunk in extraReducers
      builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload; 
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
