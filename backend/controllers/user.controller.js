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
    res.cookie("token", null, {
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

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new ApiError(400, "Please provide a valid email address"));
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        return next(new ApiError(404, "User not found with this email address"));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const frontendBaseURL = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
    const resetPasswordURL = `${frontendBaseURL}/password/reset/${resetToken}`;
    const supportEmail = process.env.SUPPORT_EMAIL || 'tempmail.backend@gmail.com';
    const companyName = process.env.COMPANY_NAME || 'ShopNest';
    const expirationTime = process.env.RESET_PASSWORD_EXPIRE || '15';

    // Enhanced email template with better compatibility
    const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Reset Your ${companyName} Password</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            @media only screen and (max-width: 600px) {
                .email-container {
                    width: 100% !important;
                    margin: 0 !important;
                }
                .content-padding {
                    padding: 20px !important;
                }
                .button {
                    padding: 12px 24px !important;
                    font-size: 16px !important;
                }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f8f9fa; line-height: 1.6; color: #333333; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        
        <!-- Email wrapper -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; min-height: 100vh;">
            <tr>
                <td style="padding: 40px 20px;" align="center">
                    
                    <!-- Main email container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                                    🔐 ${companyName}
                                </h1>
                                <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 400;">
                                    Password Reset Request
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Main content -->
                        <tr>
                            <td class="content-padding" style="padding: 40px 30px;">
                                
                                <!-- Greeting -->
                                <h2 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 24px; font-weight: 600;">
                                    Hello ${user.name || 'Valued Customer'}! 👋
                                </h2>
                                
                                <!-- Main message -->
                                <p style="margin: 0 0 20px 0; font-size: 16px; color: #4a5568; line-height: 1.6;">
                                    We received a request to reset the password for your ${companyName} account associated with <strong>${user.email}</strong>.
                                </p>
                                
                                <p style="margin: 0 0 30px 0; font-size: 16px; color: #4a5568; line-height: 1.6;">
                                    Click the button below to create a new password:
                                </p>
                                
                                <!-- CTA Button -->
                                <div style="text-align: center; margin: 35px 0;">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                        <tr>
                                            <td style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                                <a href="${resetPasswordURL}" 
                                                   target="_blank" 
                                                   rel="noopener noreferrer"
                                                   class="button"
                                                   style="display: inline-block; 
                                                          padding: 16px 32px; 
                                                          color: #ffffff; 
                                                          text-decoration: none; 
                                                          font-weight: 600; 
                                                          font-size: 16px; 
                                                          border-radius: 8px; 
                                                          transition: all 0.3s ease;
                                                          mso-hide: all;">
                                                    🔓 Reset Your Password
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Alternative link -->
                                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; font-weight: 600;">
                                        Button not working? Copy and paste this link:
                                    </p>
                                    <p style="margin: 0; word-break: break-all;">
                                        <a href="${resetPasswordURL}" 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           style="color: #667eea; text-decoration: underline; font-size: 14px;">
                                            ${resetPasswordURL}
                                        </a>
                                    </p>
                                </div>
                                
                                <!-- Security notice -->
                                <div style="background-color: #fef3cd; border-left: 4px solid #f59e0b; padding: 16px; margin: 25px 0; border-radius: 4px;">
                                    <p style="margin: 0; font-size: 14px; color: #92400e;">
                                        <strong>⚠️ Security Notice:</strong> This link will expire in <strong>${expirationTime} minutes</strong> for your security.
                                    </p>
                                </div>
                                
                                <!-- Not requested -->
                                <p style="margin: 20px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                                    If you didn't request this password reset, please ignore this email or 
                                    <a href="mailto:${supportEmail}" style="color: #667eea; text-decoration: underline;">contact our support team</a> 
                                    if you have concerns about your account security.
                                </p>
                                
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 10px 0; font-size: 16px; color: #374151; font-weight: 600;">
                                    Best regards,<br>
                                    The ${companyName} Team
                                </p>
                                <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                    This is an automated message. Please do not reply to this email.
                                </p>
                                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                        © ${new Date().getFullYear()} ${companyName}. All rights reserved.
                                    </p>
                                </div>
                            </td>
                        </tr>
                        
                    </table>
                    
                </td>
            </tr>
        </table>
        
    </body>
    </html>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: `🔐 Reset Your ${companyName} Password`,
            html: emailTemplate,
        });

        console.log(`Password reset email sent to: ${user.email} at ${new Date().toISOString()}`);

        res.status(200).json(
            new ApiResponse(200, null, `Password reset link has been sent to ${user.email}. Please check your inbox and spam folder.`)
        );

    } catch (error) {
        console.error('Password reset email error:', error);

        // Clean up the reset token if email fails
        try {
            await User.updateOne(
                { _id: user._id },
                {
                    $unset: {
                        resetPasswordToken: "",
                        resetPasswordExpire: "",
                        lastResetRequest: ""
                    }
                }
            );
        } catch (cleanupError) {
            console.error('Token cleanup error:', cleanupError);
        }

        return next(
            new ApiError(500, "Failed to send password reset email. Please try again later or contact support if the problem persists.")
        );
    }
});

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
    const users = await User.find().sort()  // this is without paramenter so it finds all users

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