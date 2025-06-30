import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, register } from '../../slices/userSlice.js';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Profile from "../../assets/Profile.png";
import AuthForm from './AuthForm.jsx';
import MetaData from '../layout/MetaData.jsx';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [avatarPreview, setAvatarPreview] = useState(Profile);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        avatar: null, // Changed to null to handle blob
    });

    const redirect = location.search ? location.search.split('=')[1] : "/";

    const { error, isAuthenticated, loading } = useSelector((state) => state.userData);

    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate(redirect);
        }
    }, [isAuthenticated, loading, navigate, redirect]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [error, dispatch]);

    const handleInputChange = (e, previewUrl) => {
        if (e.target.name === "avatar") {
            // For avatar, we get the blob from the cropper
            setFormData(prev => ({
                ...prev,
                avatar: e.target.value // This is the cropped image blob
            }));
            if (previewUrl) {
                setAvatarPreview(previewUrl);
            }
        } else {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create FormData to properly handle file upload
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);

        if (formData.avatar) {
            formDataToSend.append('avatar', formData.avatar, 'avatar.jpg');
        }

        dispatch(register(formDataToSend));
    };

    return (
        <>
            <MetaData title="Register -- ShopNest" />
            <div className="w-full max-w-md flex items-center justify-center p-4">
                <AuthForm
                    type="register"
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    avatarPreview={avatarPreview}
                />
            </div>
        </>
    );
};

export default Register;