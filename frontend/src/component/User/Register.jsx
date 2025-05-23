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
        avatar: "",
    })

    const redirect = location.search ? location.search.split('=')[1] : "/";

    const { error, isAuthenticated, loading } = useSelector((state) => state.userData);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        if (isAuthenticated && !loading) {
            navigate(redirect);
        }
    }, [isAuthenticated, loading, error, navigate, redirect]);

    const handleInputChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setFormData(prev => ({ ...prev, avatar: e.target.files[0] }));
                    setAvatarPreview(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        } else {
            const { name, value } = e.target
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(formData));
    };

    return (
        <>
            <MetaData title="Register" />
            <div className="w-full max-w-md mx-auto h-screen flex items-center justify-center p-4">
                <AuthForm
                    type="register"
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    avatarPreview={avatarPreview}
                />
            </div>
        </>
    )
}

export default Register