import express from "express"
import { getSingleOrder, myOrders, newOrder } from "../controllers/order.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const Router = express.Router();

Router.route("/new").post(verifyJWT, newOrder);
Router.route("/my").get(verifyJWT, myOrders);
Router.route("/:id").get(verifyJWT, getSingleOrder);

export default Router