import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Thunk to Fetch Product and Add to Cart
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/product/${productId}`);
            const item = {
                productId: data.data._id,
                name: data.data.name,
                price: data.data.price,
                image: data.data.images[0].url,
                stock: data.data.stock,
                quantity,
            };
            return item;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : "An error occurred"
            );
        }
    }
);
export const changeInCart = createAsyncThunk(
    "cart/changeInCart",
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/product/${productId}`);
            const item = {
                productId: data.data._id,
                name: data.data.name,
                price: data.data.price,
                image: data.data.images[0].url,
                stock: data.data.stock,
                quantity,
            };
            return item;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : "An error occurred"
            );
        }
    }
);

const initialState = {
    cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
    shippingInfo: localStorage.getItem("shippingInfo")
        ? JSON.parse(localStorage.getItem("shippingInfo"))
        : {},
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (i) => i.productId !== action.payload
            );
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        emptyCart: (state) => {
            state.cartItems = [];
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
            localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = "";
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                const item = action.payload;

                const isItemExist = state.cartItems.find(
                    (i) => i.productId === item.productId
                );

                if (isItemExist) {
                    isItemExist.quantity += item.quantity;
                    state.cartItems = state.cartItems.map((i) =>
                        i.productId === isItemExist.productId ? isItemExist : i
                    );
                } else {
                    state.cartItems.push(item);
                }

                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(changeInCart.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = "";
            })
            .addCase(changeInCart.fulfilled, (state, action) => {
                state.loading = false;
                const item = action.payload;
                state.cartItems = state.cartItems.map((i) =>
                    i.productId === item.productId ? item : i
                );
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            })
            .addCase(changeInCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { removeFromCart, emptyCart, saveShippingInfo } = cartSlice.actions;
export default cartSlice.reducer;

