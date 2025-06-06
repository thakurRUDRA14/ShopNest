import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

// Get All Products
export const getProduct = createAsyncThunk(
    'products/getProduct',
    async ({ keyword = '', currentPage = 1, price = [0, 25000], category = null, subCategory = null, ratings = 0 } = {}, { rejectWithValue }) => {
        try {

            let link = `/product/all?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

            if (category) {
                link += `&category=${encodeURIComponent(category)}`;
            }
            if (subCategory) {
                link += `&subCategory=${encodeURIComponent(subCategory)}`;
            }

            // API request
            const response = await axiosInstance.get(link);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    }
);

// Get Product Details
export const getProductDetails = createAsyncThunk(
    'products/getProductDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/product/${id}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    products: [],
    productCount: 0,
    filteredProductsCount: 0,
    resultPerPage: 0,
    productDetails: {},
    loading: false,
    error: null,
}
const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = "";
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.data.products;
                state.productCount = action.payload.data.productCount;
                state.filteredProductsCount = action.payload.data.filteredProductsCount;
                state.resultPerPage = action.payload.data.resultPerPage;

            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = "";
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.productDetails = action.payload.data;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { clearErrors } = productSlice.actions;

export default productSlice.reducer;
