import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (order, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const { data } = await axios.post("/api/order/new", order, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const myOrders = createAsyncThunk(
    'orders/myOrder',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/order/my');
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const getOrderDetails = createAsyncThunk(
    'orders/getOrderDetails',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/order/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const initialState = {
    newOrder: {},
    orders: [],
    orderDetails: null,
    loading: false,
    error: null
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.newOrder = action.payload.data
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(myOrders.pending, (state) => {
                state.loading = true
            })
            .addCase(myOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data
            })
            .addCase(myOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload.data;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { clearErrors } = orderSlice.actions;
export default orderSlice.reducer;