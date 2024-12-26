import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create product review
const createProductReview = asyncHandler(async (req, res, next) => {

    const { _id: userId, name, avatar } = req.user;

    const { rating, comment, productId } = req.body;

    const review = {
        userId,
        name,
        avatar,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId)

    const isReviewed = product.reviews.find(review => (review && review.userId && req.user._id && review.userId.toString() === req.user._id.toString()))
    let message;
    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.userId.toString() === req.user._id.toString()) {
                review.comment = comment
                review.rating = rating
                review.name = req.user.name
                review.avatar = req.user.avatar
            }
        })
        message = "Review updated successfully"
    } else {
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length;
        message = "Review added successfully"
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save({ validateBeforeSave: false })

    res.status(200).json(new ApiResponse(200, review, message))
})

// Get all review
const getAllReviews = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.query._id);

    if (!product) {
        return next(new ApiError("Product not found", 404))
    }

    res.status(200).json(new ApiResponse(200, product.reviews, "All review fetched successfully"))
})

// Delete review
const deleteReview = asyncHandler(async (req, res, next) => {
    const { productId, reviewId } = req.query;
    if (!productId || !reviewId) {
        return next(new ApiError("Product ID and Review ID are required", 400));
    }

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ApiError("Product not found", 404))
    }

    const updatedReviews = product.reviews.filter((review) => (review._id.toString() !== reviewId.toString()))

    const totalRating = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const ratings = updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;

    product.reviews = updatedReviews;
    product.ratings = ratings;
    product.numberOfReviews = updatedReviews.length;

    await product.save();

    res.status(200).json(new ApiResponse(200, product.reviews, "Review deleted successfully"))
})

export {
    createProductReview,
    getAllReviews,
    deleteReview
}