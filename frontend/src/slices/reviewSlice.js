import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const newReview = createAsyncThunk(
    'reviews/newReview',
    async (reviewForm, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const response = await axios.put('/api/review/new', reviewForm, config);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    }
);

// Get All Reviews of a Product
export const getAllReviews = createAsyncThunk(
    'reviews/getAllReviews',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/review/all?_id=${id}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    }
);

// Delete Review of a Product
export const deleteReviews = createAsyncThunk(
    'reviews/deleteReviews',
    async ({ reviewId, productId }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/review/delete?reviewId=${reviewId}&productId=${productId}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            return rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    message: "",
    loading: false,
    error: null,
    operationSuccess: false,
    reviews: [],
}

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
            state.message = "";
        },
        resetOperationStatus: (state) => {
            state.operationSuccess = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(newReview.pending, (state) => {
                state.loading = true;
            })
            .addCase(newReview.fulfilled, (state, action) => {
                state.loading = false;
                state.operationSuccess = action.payload.success;
                state.message = action.payload.message;
            })
            .addCase(newReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllReviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(getAllReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteReviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.operationSuccess = action.payload.success;
                state.message = action.payload.message;
            })
            .addCase(deleteReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearErrors, resetOperationStatus } = reviewSlice.actions;

export default reviewSlice.reducer;