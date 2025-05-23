import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../layout/Loader/Loader.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MailOutline, LockOpen, Visibility, VisibilityOff, PhotoCamera } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearErrors } from "../../../slices/userSlice.js";

const AuthForm = ({ type, formData, onInputChange, onSubmit, avatarPreview }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { error, loading, isAuthenticated } = useSelector(
        (state) => state.userData
    );

    const [showPassword, setShowPassword] = useState(false);
    const redirect = location.search ? location.search.split('=')[1] : "/";

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearErrors();
        }

        if (isAuthenticated && !loading) {
            navigate(redirect);
        }
    }, [error, isAuthenticated, loading, navigate, redirect]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="w-full max-w-md mx-auto h-screen flex items-center justify-center p-4">
            <motion.div
                layout
                className="bg-white rounded-2xl shadow-xl overflow-hidden w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Tab Switcher */}
                <div className="flex relative bg-gray-50">
                    <Link
                        to="/login"
                        className={`flex-1 py-4 font-medium text-center transition-colors ${
                            type === "login" 
                                ? "text-primary border-b-2 border-primary" 
                                : "text-gray-500 hover:text-primary"
                        }`}
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className={`flex-1 py-4 font-medium text-center transition-colors ${
                            type === "register" 
                                ? "text-primary border-b-2 border-primary" 
                                : "text-gray-500 hover:text-primary"
                        }`}
                    >
                        Register
                    </Link>
                </div>

                <motion.div layout className="p-8">
                    <form onSubmit={onSubmit}>
                        <motion.div layout className="space-y-4">
                            {/* Avatar Upload (Register only) */}
                            <AnimatePresence>
                                {type === 'register' && (
                                    <motion.div
                                        layout
                                        layoutId="avatar-container"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex justify-center"
                                    >
                                        <div className="relative group">
                                            <motion.img
                                                layoutId="avatar-image"
                                                src={avatarPreview}
                                                alt="Avatar Preview"
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                                            />
                                            <motion.label
                                                layoutId="avatar-label"
                                                className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer shadow-lg transform group-hover:scale-105 transition-transform"
                                            >
                                                <PhotoCamera></PhotoCamera>
                                                <input
                                                    type="file"
                                                    name="avatar"
                                                    accept="image/*"
                                                    onChange={onInputChange}
                                                    className="hidden"
                                                />
                                            </motion.label>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Name Field (Register only) */}
                            <AnimatePresence>
                                {type === 'register' && (
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
                            </AnimatePresence>

                            {/* Email Field */}
                            <motion.div layout layoutId="email-field">
                                <LabelledInput
                                    id='email'
                                    name="email"
                                    label="Email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={onInputChange}
                                    icon={<MailOutline className="h-5 w-5 text-gray-400" />}
                                />
                            </motion.div>

                            {/* Password Field */}
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
                                    }
                                />
                            </motion.div>

                            {/* Forgot Password (Login only) */}
                            <AnimatePresence>
                                {type === "login" && (
                                    <motion.div
                                        layout
                                        layoutId="forgot-password-container"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-end"
                                    >
                                        <Link
                                            to="/password/forget"
                                            className="text-sm text-primary hover:text-primary-dark"
                                        >
                                            Forgot password?
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <motion.div 
                                layout
                                layoutId="submit-button-container"
                                className="pt-2"
                            >
                                <motion.button
                                    layout
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                                >
                                    {type === "login" ? "Log in" : "Create Account"}
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </form>

                    {/* Switch Form */}
                    <motion.div layout className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    {type === "register" ? "Already have an account?" : "New to ShopNest?"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Link
                                to={type === "register" ? "/login" : "/register"}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                                {type === "login" ? "Create an account" : "Log in instead"}
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
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