import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { MailOutline, LockOpen, Visibility, VisibilityOff, PhotoCamera } from "@mui/icons-material";
import { useSelector } from "react-redux";
import ImageCropper from "../UI/ImageCropper";
import { useImageCropper } from "../../hooks/useImageCropper";

const AuthForm = ({ type, formData, onInputChange, onSubmit, avatarPreview }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { loading } = useSelector((state) => state.userData);

    const {
        imageToCrop,
        cropperOpen,
        fileInputRef,
        handleImageChange,
        onCropComplete,
        setCropperOpen
    } = useImageCropper((croppedImageBlob, previewUrl) => {
        // This callback will be called when cropping is complete
        const fakeEvent = {
            target: {
                name: "avatar",
                value: croppedImageBlob
            }
        };
        onInputChange(fakeEvent, previewUrl);
    });

    return (

        <motion.div
            layoutId="auth-form"
            className="bg-white rounded-2xl shadow-xl overflow-hidden w-full"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >

            {(type === 'login' || type === 'register') ? (
                <div className="flex relative bg-gray-50">
                    <Link
                        to="/login"
                        className={`flex-1 py-4 font-medium text-center transition-colors ${type === "login"
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-500 hover:text-primary"
                            }`}
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className={`flex-1 py-4 font-medium text-center transition-colors ${type === "register"
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-500 hover:text-primary"
                            }`}
                    >
                        Register
                    </Link>
                </div>
            ) : (
                <h2 className={`w-full py-4 font-medium text-center text-primary border-b-2 border-primary bg-gray-50`}>
                    {type === "updateUser" ? "Update Profile" : type === "updatePassword" ? "Update Password" : type === "resetPassword" ? "Reset Password" : "Forget Password"}
                </h2>
            )}

            <motion.div layout className="p-8">

                <motion.div layout className="space-y-4">

                    {/* Avatar Upload (Register only) */}
                    {(type === 'register' || type === 'updateUser') && (
                        <motion.div
                            layoutId="avatar-container"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="flex justify-center"
                        >
                            <div className="relative group">
                                <motion.img
                                    layout
                                    src={avatarPreview}
                                    alt="Avatar Preview"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                                />
                                <motion.label className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer shadow-lg transform group-hover:scale-105 transition-transform">
                                    <PhotoCamera />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        ref={fileInputRef}
                                    />
                                </motion.label>
                            </div>
                        </motion.div>
                    )}

                    <ImageCropper
                        open={cropperOpen}
                        onClose={() => setCropperOpen(false)}
                        image={imageToCrop}
                        onCropComplete={onCropComplete}
                        aspect={1}
                    />

                    {/* Name Field (Register only) */}

                    {(type === 'register' || type === 'updateUser') && (
                        <motion.div
                            layout
                            layoutId="name-field-container"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <LabelledInput
                                id='name'
                                name="name"
                                label="Name"
                                placeholder="Enter your name"
                                value={formData.name || ''}
                                onChange={onInputChange}
                            />
                        </motion.div>
                    )}


                    {/* Email Field */}
                    {((type === 'login' || type === 'register' || type === 'updateUser' || type === 'forgetPassword') && (<motion.div layout layoutId="email-field">
                        <LabelledInput
                            id='email'
                            name="email"
                            label="Email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={onInputChange}
                            icon={<MailOutline className="h-5 w-5 text-gray-400" />}
                        />
                    </motion.div>))}

                    {/* Password Field */}

                    {(type === 'updatePassword') &&
                        <motion.div layout layoutId="update-password-field">
                            <LabelledInput
                                id='oldPassword'
                                name="oldPassword"
                                label="Old Password"
                                placeholder="Enter your old password"
                                value={formData.oldPassword}
                                onChange={onInputChange}
                                icon={<LockOpen className="h-5 w-5 text-gray-400" />}
                            />
                        </motion.div>}

                    {(type === 'login' || type === 'register' || type === 'updatePassword' || type === 'resetPassword') &&
                        <motion.div layout layoutId="password-field">
                            <LabelledInput
                                id='password'
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={onInputChange}
                                icon={<LockOpen className="h-5 w-5 text-gray-400" />}
                                endAdornment={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff className="h-5 w-5" />
                                        ) : (
                                            <Visibility className="h-5 w-5" />
                                        )}
                                    </button>
                                } />
                        </motion.div>}

                    {(type === 'updatePassword' || type === 'resetPassword') &&
                        <motion.div layout layoutId="confirm-password-field">
                            <LabelledInput
                                id='confirmPassword'
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={onInputChange}
                                icon={<LockOpen className="h-5 w-5 text-gray-400" />}
                                endAdornment={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        {showConfirmPassword ? (
                                            <VisibilityOff className="h-5 w-5" />
                                        ) : (
                                            <Visibility className="h-5 w-5" />
                                        )}
                                    </button>
                                } />
                        </motion.div>}

                    {(type === "login" || type === "updatePassword") && (
                        <motion.div
                            layout
                            layoutId="forgot-password-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-end"
                        >
                            <Link
                                to={`/password/${type === "forgetPassword" ? "update" : "forget"}`}
                                className="text-sm text-primary hover:text-primary-dark"
                            >
                                Forgot password?
                            </Link>
                        </motion.div>
                    )}


                    {/* Submit Button */}
                    <motion.div
                        layout
                        layoutId="submit-button-container"
                        className="pt-2"
                    >
                        <motion.button
                            layout
                            onClick={onSubmit}
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {type === "login" ? "Logging in..." :
                                        type === "register" ? "Creating account..." :
                                            type === "resetPassword" ? "Resetting..." :
                                                type === "forgetPassword" ? "Processing..." :
                                                    "Updating..."}
                                </div>
                            ) : (
                                type === "login" ? "Log in" :
                                    type === "register" ? "Create Account" :
                                        type === "resetPassword" ? "Reset" :
                                            type === "forgetPassword" ? "Forget" :
                                                "Update"
                            )}
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Switch Form */}
                {(type === 'login' || type === 'register') && (<motion.div layout className="mt-6">
                    <motion.div layoutId="ques" className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                {type === "register" ? "Already have an account?" : "New to ShopNest?"}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div layoutId="otr-link" className="mt-4">
                        <Link
                            to={type === "register" ? "/login" : "/register"}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            {type === "login" ? "Create an account" : "Log in instead"}
                        </Link>
                    </motion.div>
                </motion.div>)}
            </motion.div>
        </motion.div>
    );
};

const LabelledInput = ({
    id,
    name,
    label,
    placeholder,
    type = "text",
    value,
    onChange,
    icon,
    endAdornment
}) => {
    return (
        <motion.div layout>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    name={name}
                    value={value}
                    onChange={onChange}
                    type={type}
                    id={id}
                    className={`w-full ${icon ? 'pl-10' : 'pl-3'} ${endAdornment ? 'pr-10' : 'pr-3'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
                    placeholder={placeholder}
                    required
                />
                {endAdornment && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {endAdornment}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AuthForm;