import express from "express";
import { getAllProducts, getProductDetails, } from "../controllers/product.controller.js";

const Router = express.Router();

Router.route("/all").get(getAllProducts)
Router.route("/:_id").get(getProductDetails);

export default Router