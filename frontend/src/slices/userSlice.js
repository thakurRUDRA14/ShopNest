import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
    "user/login",
    async (userLoginForm, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } };
            const Response = await axios.post(`/api/user/login`, userLoginForm, config);
            return Response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    });

export const register = createAsyncThunk(
    "user/register",
    async (userRegisterForm, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            const response = await axios.post(`/api/user/register`, userRegisterForm, config);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    });

export const loadUser = createAsyncThunk(
    "user/loadUser",
    async (_, { rejectWithValue }) => {
        try {
            const Response = await axios.get("/api/user/me");
            return Response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    });

export const logout = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            const Response = await axios.get("/api/user/logout");
            return Response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    });

export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async (updateProfileForm, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            const Response = await axios.put(`/api/user/me/update`, updateProfileForm, config);
            return Response.data;
        } catch (error) {
            rejectWithValue(error.response.data.message)
        }
    });

export const updatePassword = createAsyncThunk(
    "user/updatePassword",
    async (updatePasswordForm, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } };
            const Response = await axios.put(`/api/user/password/update`, updatePasswordForm, config);
            return Response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage)
        }
    });

export const forgetPassword = createAsyncThunk(
    "user/forgetPassword",
    async (email, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } };
            const Response = await axios.post(`/api/user/password/forget`, email, config);
            return Response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage)
        }
    });

export const resetPassword = createAsyncThunk(
    "user/resetPassword",
    async ({ token, resetPasswordForm }, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } };
            const Response = await axios.put(`/api/user/password/reset/${token}`, resetPasswordForm, config);
            return Response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage)
        }
    });

const initialState = {
    user: null,
    isAuthenticated: false,
    isUpdated: false,
    loading: false,
    error: null,
    message: "",
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
            state.message = "";
        },
        resetUpdateStatus: (state) => {
            state.isUpdated = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.message = action.payload.message;
                state.user = action.payload.data
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data
                state.message = action.payload.message;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.message = action.payload.message;
                state.user = action.payload.data;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.message = action.payload.message;
                state.user = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.isUpdated = true;
                state.message = action.payload.message;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.isUpdated = true;
                state.message = action.payload.message;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(forgetPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(forgetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(forgetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.isUpdated = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload.message;
            })
    },
});

export const { clearErrors, resetUpdateStatus } = userSlice.actions;
export default userSlice.reducer;
