import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../utils/axiosInstance";

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (order, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const { data } = await axiosInstance.post("/order/new", order, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const myOrders = createAsyncThunk(
    'orders/myOrder',
    async (currentPage = 1, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/order/my?page=${currentPage}`);
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
            const { data } = await axiosInstance.get(`/order/${id}`);
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
    ordersCount: 0,
    resultsPerPage: 0,
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
                state.error = null;
                state.message = "";
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
                state.loading = true;
                state.error = null;
                state.message = "";
            })
            .addCase(myOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data.orders
                state.ordersCount = action.payload.data.ordersCount;
                state.resultsPerPage = action.payload.data.resultsPerPage;
            })
            .addCase(myOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = "";
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