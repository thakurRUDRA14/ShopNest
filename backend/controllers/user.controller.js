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

// Forget password
const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ApiError(400, "Email is required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ApiError(404, "User not found with this email address"));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/user/password/reset/${resetToken}`;

    const message = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4a90e2;">ShopNest Password Assistance</h1>
          </div>
          
          <p>Hello ${user.name || 'ShopNest Customer'},</p>
          
          <p>We received a request to reset your ShopNest account password. Click the link below to proceed:</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetPasswordURL}" 
               style="background-color: #4a90e2; color: white; padding: 10px 20px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Your Password
            </a>
          </div>
          
          <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          
          <p style="font-size: 0.9em; color: #999;">
            This link will expire in ${process.env.RESET_PASSWORD_EXPIRE || '15'} minutes.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e1e1; font-size: 0.9em;">
            <p>Thank you,<br>The ShopNest Team</p>
          </div>
        </div>
      </body>
    </html>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: `ShopNest Password Reset Request`,
            html: message,
        });

        res.status(200).json(
            new ApiResponse(200, null, `Password reset link has been sent to ${user.email}. Please check your inbox.`)
        );

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

        return next(
            new ApiError(500, "Failed to send password reset email. Please try again later.")
        );
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

        avatar = await uploadOnCloudinary(avatarLocalPath, "avatars");

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

const contactForm = asyncHandler(async (req, res, next) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return next(new ApiError(400, "All fields are required"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new ApiError(400, "Please enter a valid email address"));
    }

    const emailMessage = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4a90e2;">New Contact Form Submission</h1>
          </div>
          
          <p><strong>From:</strong> ${name} (${email})</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 15px 0;">
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e1e1; font-size: 0.9em;">
            <p>This message was sent via your ShopNest contact form.</p>
          </div>
        </div>
      </body>
    </html>
    `;

    try {
        await sendEmail({
            email: process.env.CONTACT_FORM_RECIPIENT,
            subject: `New Contact Form Submission from ${name}`,
            html: emailMessage,
        });

        //Send confirmation to the user
        await sendEmail({
            email: email,
            subject: `Thank you for contacting ShopNest`,
            html: `<p>Dear ${name},</p><p>We've received your message and will get back to you soon.</p>`
        });

        res.status(200).json(
            new ApiResponse(200, null, "Your message has been sent successfully!")
        );

    } catch (error) {
        return next(
            new ApiError(500, "Failed to send your message. Please try again later.")
        );
    }
});

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
    deleteUser,
    contactForm
}