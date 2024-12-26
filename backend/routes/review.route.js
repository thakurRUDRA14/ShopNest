import express from "express";
import { createProductReview, deleteReview, getAllReviews } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const Router = express.Router();

Router.route("/new").put(verifyJWT, createProductReview);
Router.route("/all").get(getAllReviews)
Router.route("/delete").delete(verifyJWT, deleteReview);

export default Router