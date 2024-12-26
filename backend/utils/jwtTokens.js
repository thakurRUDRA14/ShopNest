import { ApiResponse } from "./ApiResponse.js";

const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken();

    //options for cookie
    const options = {
        expires: new Date(
            Date.now() + (process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000)
        ),
        httpOnly: true,
    };

    res.status(statusCode).cookie("userToken", token, options).json(
        new ApiResponse(statusCode, user, message)
    )
}

export default sendToken