import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

//Create product --admin
const createProduct = asyncHandler(async (req, res, next) => {

    const { name, description, price, category, stock } = req.body;
    req.body.user = req.user._id;

    if (!req.files || req.files.length === 0) {
        return next(new ApiError(400, "No images provided"));
    }

    const imagesLink = [];
    for (const file of req.files) {

        const uploadResponse = await uploadOnCloudinary(file.path, "products");
        if (uploadResponse) {
            imagesLink.push({
                public_id: uploadResponse.public_id,
                url: uploadResponse.url,
            });
        }
        else {
            return next(new ApiError(500, "Error uploading images"));
        }
    }

    const product = await Product.create({
        name,
        description,
        price,
        category,
        images: imagesLink,
        stock,
        user: req.user._id,
    });

    res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

//Get all products
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

// Get product details
const getProductDetails = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params._id);

    if (!product) {
        return next(new ApiError(404, "Product not found"))
    }

    res.status(200).json(new ApiResponse(200, product, "Product found successfully"))

})

// Get all product -- Admin
const getAdminProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find();
    res
        .status(200)
        .json(new ApiResponse(200, products, "All product fetched successfully"))
});

// Update product -- Admin
const updateProduct = asyncHandler(async (req, res, next) => {

    let product = await Product.findById(req.params._id);

    if (!product) {
        return next(new ApiResponse(404, "Product not found"))
    }

    const { name, description, price, category, stock } = req.body;
    if (!req.files || req.files.length === 0) {
        product = await Product.findByIdAndUpdate(
            req.params._id,
            {
                name,
                description,
                price,
                category,
                stock
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false
            }
        )
    }
    else {
        const imagesLink = [];
        for (const file of req.files) {

            const uploadResponse = await uploadOnCloudinary(file.path, "products");
            if (uploadResponse) {
                imagesLink.push({
                    public_id: uploadResponse.public_id,
                    url: uploadResponse.url,
                });
            }
            else {
                return next(new ApiError(500, "Error uploading images"));
            }
        }
        product = await Product.findByIdAndUpdate(
            req.params._id,
            {
                name,
                description,
                price,
                category,
                images: imagesLink,
                stock
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false
            }
        )
    }


    res.status(200).json(new ApiResponse(200, product, "Product updated successfully."))
})

// Delet product -- Admin
const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params._id);

    if (!product) {
        return next(new ApiError(404, "Product not found"))
    }

    for (const image of product.images) {
        deleteFromCloudinary(image.public_id);
    }

    await product.deleteOne();
    res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"))
})

export {
    createProduct,
    getAllProducts,
    getAdminProducts,
    updateProduct,
    deleteProduct,
    getProductDetails,
}