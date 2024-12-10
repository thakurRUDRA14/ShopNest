import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


//Create product --admin
const createProduct = asyncHandler(async (req, res, next) => {
    req.body.user = req.user._id
    // const { name, price, description, category, images } = req.body
    const product = await Product.create(req.body)
    res
        .status(201)
        .json(new ApiResponse(201, product, "Product created successfully"))
})

const getAllProducts = asyncHandler(async (req, res) => {

    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    let apiFeature = new ApiFeatures(Product.find(), req.query).search().filter()
    let products = await apiFeature.query;
    const filteredProductsCount = products.length;
    apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)
    products = await apiFeature.query;
    res
        .status(200)
        .json(new ApiResponse(200, { products, productCount, filteredProductsCount, resultPerPage }, "All product fetched successfully"))
})


// update products
const updateProduct = asyncHandler(async (req, res, next) => {

    let product = await Product.findById(req.params._id);

    if (!product) {
        return next(new ApiResponse(404, "Product not found"))
    }

    product = await Product.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json(new ApiResponse(200, product, "Product updated successfully."))
})

const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params._id);

    if (!product) {
        return next(new ApiError(404, "Product not found"))
        // throw new ApiError(404, "Product not found")
    }

    await product.deleteOne();

    res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"))
})

const getProductDetails = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params._id);

    if (!product) {
        return next(new ApiError(404, "Product not found"))
    }

    res.status(200).json(new ApiResponse(200, product, "Product found successfully"))

})

// create new review or update review
const createProductReview = asyncHandler(async (req, res, next) => {

    const { _id: userId, name } = req.user;

    const { rating, comment, productId } = req.body;

    const review = {
        userId,
        name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId)

    const isReviewed = product.reviews.find(review => (review && review.userId && req.user._id && review.userId.toString() === req.user._id.toString()))

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.userId.toString() === req.user._id.toString()) {
                review.comment = comment
                review.rating = rating
            }
        })
    } else {
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save({ validateBeforeSave: false })

    res.status(200).json(new ApiResponse(200, review, "Review added successfully"))
})


// not working
const getAllReviews = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.query._id);

    if (!product) {
        return next(new ApiError("Product not found", 404))
    }

    res.status(200).json(200, product.reviews, "All review fetched successfully")
})

const deleteReview = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ApiError("Product not found", 404))
    }

    const reviews = product.reviews.filter((review) => (review._id.toString() !== req.query._id.toString()))

    let totalRating = 0;
    reviews.forEach((rev) => {
        totalRating += rev.rating;
    });

    const ratings = totalRating / reviews.length;
    const numberOfReviews = reviews.length;

    await product.findByIdAndUpdate(req.query._id, {
        reviews,
        ratings,
        numberOfReviews,
    }, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })

    res.status(200).json(200, product.reviews, "All review fetched successfully")
})

export {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    getAllReviews,
    deleteReview
}