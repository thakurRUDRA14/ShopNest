import express from "express"
import { deleteOrder, getAllOrders, getSingleOrder, myOrders, newOrder, updateOrder } from "../controllers/order.controller.js"
import { authorizedRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const Router = express.Router();


Router.route("/new").get(verifyJWT, newOrder);
Router.route("/:id").get(verifyJWT, getSingleOrder);
Router.route("/me").get(verifyJWT, myOrders);
Router.route("/admin/all").get(verifyJWT, authorizedRoles("admin"), getAllOrders);
Router.route("/admin/:_id").put(verifyJWT, authorizedRoles("admin"), updateOrder).delete(verifyJWT, authorizedRoles("admin"), deleteOrder);

export default Router