import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please Enter product Description"],
    },
    price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        maxLength: [8, "Price cannot exceed 8 characters"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"],
    },
    // category: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Category",
    //     required: [true, "Please Enter Product Category"],
    // },
    stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxLength: [5, "Stock cannot exceed 5 characters"],
        default: 1,
    },
    numberOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            userId: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            avatar: {
                public_id: {
                    type: String,
                },
                url: {
                    type: String,
                },
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
