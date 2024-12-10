import express from "express";
import {
    deleteUser,
    forgetPassword,
    getAllUser,
    getAnyUser,
    getUserDetails,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword,
    updatePassword,
    updateProfile,
    updateUserRole
} from "../controllers/user.controller.js";
import { authorizedRoles, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const Router = express.Router()

Router.route("/register").post(upload.single('avatar'), registerUser)
Router.route("/login").post(loginUser)
Router.route("/logout").get(logoutUser)
Router.route("/password/forget").post(forgetPassword)
Router.route("/password/reset/:token").put(resetPassword)
Router.route("/me").get(verifyJWT, getUserDetails)
Router.route("/password/update").put(verifyJWT, updatePassword)
Router.route("/me/update").put(verifyJWT, upload.single('avatar'), updateProfile)
Router.route("/admin/users").get(verifyJWT, authorizedRoles("admin"), getAllUser)
Router.route("/admin/user/:_id")
    .get(verifyJWT, authorizedRoles("admin"), getAnyUser)
    .put(verifyJWT, authorizedRoles("admin"), updateUserRole)
    .delete(verifyJWT, authorizedRoles("admin"), deleteUser)

export default Router