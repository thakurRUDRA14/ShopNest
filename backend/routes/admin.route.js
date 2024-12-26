import express from "express";
import { deleteUser, getAllUsers, getAnyUser, updateUserRole } from "../controllers/user.controller.js";
import { createProduct, deleteProduct, getAdminProducts, updateProduct } from "../controllers/product.controller.js";
import { deleteOrder, getAllOrders, updateOrder } from "../controllers/order.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const Router = express.Router()

//user
Router.route("/users").get(getAllUsers)
Router.route("/user/:_id")
    .get(getAnyUser)
    .put(updateUserRole)
    .delete(deleteUser)

//product
Router.route("/product/all").get(getAdminProducts)
Router.route("/product/new").post(upload.array("images", 6), createProduct)
Router.route("/product/:_id").put(upload.array("images", 6), updateProduct).delete(deleteProduct)

//order
Router.route("/orders/all").get(getAllOrders);
Router.route("/order/:_id").put(updateOrder).delete(deleteOrder);

export default Router