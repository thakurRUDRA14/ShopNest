import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { login, clearErrors } from '../../slices/userSlice';
import AuthForm from './AuthForm';
import MetaData from '../layout/MetaData';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

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
    }, [error, dispatch])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    return (
        <>
            <MetaData title="Login" />
            <div className="w-full max-w-md mx-auto h-screen flex items-center justify-center p-4">
                <AuthForm
                    type="login"
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    )
}

export default Login