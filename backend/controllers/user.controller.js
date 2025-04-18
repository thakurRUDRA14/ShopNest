import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import sendToken from "../utils/jwtTokens.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';

// Register user
const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return next(new ApiError(300, "User already existed"))
    }

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        return next(new ApiError(400, "Image is required"))
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath, "avatars")

    if (!avatar) {
        return next(new ApiError(400, "Unable to upload image"))
    }
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: avatar.public_id,
            url: avatar.url
        },
    })

    // const token = user.getJWTToken();
    // res.status(201).json(new ApiResponse(201, { user, token }, "User Created Successfully."))
    sendToken(user, 201, res, "User created successfully")
})

//login user
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // cheking if user has given password and email both
    if (!email || !password) {
        next(new ApiError(400, "Please enter email and password"))
    }

    let user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ApiError(404, "User not found"))
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return next(new ApiError(401, "Invalid Email or Password"))
    }
    user = await User.findOne({ email })
    // res.status(201).json(new ApiResponse(201, token, "User logged in successfully"))
    sendToken(user, 201, res, "User logged in successfully")
})

//logout user
const logoutUser = asyncHandler(async (req, res, next) => {
    res.cookie("userToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true
    });

    res.status(200).json(new ApiResponse(200, null, "User logged out successfully"))
})

//Forget password
const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        return next(new ApiError(404, "User not found"))
    }

    // Get resetPasswordToken

    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false });

    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/user/password/reset/${resetToken}`

    const message = `Your password reset token is :- \n\n ${resetPasswordURL} \n\nIf you have not requested this email, please ignore it.`

    try {

        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        })

        res.status(200).json(new ApiResponse(200, null, `Email sent to ${user.email} successfully.`))

    } catch (error) {
        await User.updateOne(
            {
                _id: user._id
            },
            {
                $unset: {
                    resetPasswordToken: "",
                    resetPasswordExpire: ""
                }
            }
        );

        return next(new ApiError(500, "Error sending email. Please try again later."))
    }

})

// Reset password
const resetPassword = asyncHandler(async (req, res, next) => {

    const { token } = req.params
    const { password, confirmPassword } = req.body

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })


    if (!user) {
        return next(new ApiError(400, "Reset Password Token is invalid or has been expired"))
    }

    if (password !== confirmPassword) {
        return next(new ApiError(400, "Password does not match"))
    }

    user.password = password
    await user.save()
    await User.updateOne(
        {
            _id: user._id
        },
        {
            $unset: {
                resetPasswordToken: "",
                resetPasswordExpire: ""
            }
        }
    );


    sendToken(user, 200, res, "Password reset successfully");
})

// Get user details
const getUserDetails = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user?.id);
    res.status(200).json(new ApiResponse(200, user))

})

// Update password
const updatePassword = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id).select("+password");

    const isPasswordMatched = await user.isPasswordCorrect(req.body.oldPassword)

    if (!isPasswordMatched) {
        return next(new ApiError(400, "Old Password is incorrect"))
    }

    if (req.body.newPassword != req.body.confirmPassword) {
        return next(new ApiError(400, "Password does not match"))
    }

    user.password = req.body.newPassword;
    await user.save()

    res.status(200).json(new ApiResponse(200, user, "password changed successfully"))

})

// Update user profile
const updateProfile = asyncHandler(async (req, res, next) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return next(new ApiError(400, "Name and Email are required"));
    }

    // Check if an avatar file was uploaded
    let avatar;
    if (req.file?.path) {
        const avatarLocalPath = req.file.path;

        avatar = await uploadOnCloudinary(avatarLocalPath);

        if (!avatar) {
            return next(new ApiError(400, "Failed to upload avatar"));
        }
    }

    const updateData = {
        name,
        email,
    };

    if (avatar) {
        updateData.avatar = avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: updateData },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedUser) {
        return next(new ApiError(404, "User not found"));
    }

    res.status(200).json(
        new ApiResponse(200, null, "Changes saved successfully")
    );
});

// Get all users  --Admin
const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find()  // this is without paramenter so it finds all users

    res.status(200).json(new ApiResponse(200, users, "All users fetched successfully."))
})

// Get single user details --Admin
const getAnyUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params._id);

    if (!user) {
        return next(new ApiError(404, `User doesn't exists with id : ${req.params._id}`))
    }

    res.status(200).json(new ApiResponse(200, user, "User detail fetched successfully."))
})

// Update user role --Admin
const updateUserRole = asyncHandler(async (req, res, next) => {
    const { name, email, role } = req.body

    if (!name || !email || !role) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(req.params?._id,
        {
            $set: {
                name,
                email,
                role
            }
        },
        {
            new: true,
            runValidators: true,
            userFindAndModify: false
        });

    await user.save()

    res.status(200).json(new ApiResponse(200, null, "Changes saved successfully",))

})

// Delete user --Admin
const deleteUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params?._id);

    if (!user) {
        return next(new ApiError(404, `No user exists with id:${req.params?._id}`))
    }

    if (user?.image) {
        deleteFromCloudinary(user.image?.public_id);
    }

    await user.deleteOne();
    res.status(200).json(new ApiResponse(200, null, "User deleted successfully",))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    forgetPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getAnyUser,
    updateUserRole,
    deleteUser
}