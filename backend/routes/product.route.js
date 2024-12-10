import express from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductDetails,
    createProductReview,
    deleteReview,
    getAllReviews
} from "../controllers/product.controller.js";
import { authorizedRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const Router = express.Router();

Router.route("/all").get(getAllProducts)

//Admin access only
Router.route("/admin/new").post(verifyJWT, authorizedRoles("admin"), createProduct)
Router.route("/admin/:_id").put(verifyJWT, authorizedRoles("admin"), updateProduct).delete(verifyJWT, authorizedRoles("admin"), deleteProduct)
Router.route("/:_id").get(getProductDetails);
Router.route("/review").put(verifyJWT, createProductReview);
Router.route("/reviews").get(getAllReviews).delete(verifyJWT, deleteReview);

export default Router