import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Get All Users
export const getAllUsers = createAsyncThunk(
    "user/admin/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/admin/users`);
            return response.data;
        } catch (error) {
            rejectWithValue(error.response.data.message);
        }
    }
);
// Get Any User
export const getAnyUser = createAsyncThunk(
    "user/admin/getAnyUser",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/admin/user/${userId}`);
            return response.data;
        } catch (error) {
            rejectWithValue(error.response.data.message);
        }
    }
);
// Delete User
export const deleteUser = createAsyncThunk(
    'products/admin/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/admin/user/${id}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    }
);
// Update User
export const updateUser = createAsyncThunk(
    'products/admin/updateUser',
    async ({ userId, updateUserForm }, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const response = await axios.put(`/api/admin/user/${userId}`, updateUserForm, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get All Products
export const getAdminProduct = createAsyncThunk(
    'products/admin/getAdminProduct',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/admin/product/all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
// Create Product
export const createProduct = createAsyncThunk(
    'products/admin/createProduct',
    async (newProductForm, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            const response = await axios.post('/api/admin/product/new', newProductForm, config);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    }
);
// Update Product
export const updateProduct = createAsyncThunk(
    'products/admin/updateProduct',
    async ({ productId, updateProductForm }, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            const response = await axios.put(`/api/admin/product/${productId}`, updateProductForm, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
// Delete Product
export const deleteProduct = createAsyncThunk(
    'products/admin/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/admin/product/${id}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    }
);

//Get All Orders
export const getAllOrders = createAsyncThunk(
    "orders/admin/getAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/admin/orders/all');
            return response.data;
        } catch (error) {
            rejectWithValue(error.response.data.message);
        }
    }
);
// Update Order
export const updateOrder = createAsyncThunk(
    'products/admin/updateOrder',
    async ({ orderId, updateOrderForm }, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const response = await axios.put(`/api/admin/order/${orderId}`, updateOrderForm, config);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    }
);
// Delete Product
export const deleteOrder = createAsyncThunk(
    'products/admin/deleteOrder',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/admin/order/${id}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    users: [],
    orders: [],
    products: [],
    user: {},
    message: "",
    error: null,
    loading: false,
    operationSuccess: false,
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
            state.message = "";
        },
        resetOperationStatus: (state) => {
            state.operationSuccess = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(getAnyUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAnyUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
            })
            .addCase(getAnyUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.operationSuccess = action.payload.success;
                state.message = action.payload.message;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.operationSuccess = action.payload.success;
                state.message = action.payload.message;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAdminProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAdminProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.data;
            })
            .addCase(getAdminProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.operationSuccess = action.payload.success;
                state.message = action.payload.message;

            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.operationSuccess = action.payload.success;
                state.message = action.payload.message;

            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.operationSuccess = action.payload.success;
                state.message = action.payload.message;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data.orders;
                state.message = action.payload.message;

            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.operationSuccess = action.payload.success;
                state.message = action.payload.message;
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.operationSuccess = action.payload.success;
                state.message = action.payload.message;
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { clearErrors, resetOperationStatus } = adminSlice.actions;
export default adminSlice.reducer;