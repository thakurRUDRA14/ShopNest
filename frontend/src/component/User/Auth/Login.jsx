import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../slices/userSlice';
import { useState } from 'react';
import AuthForm from './AuthForm';

const Login = () => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

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
        <AuthForm
            type="login"
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
        />
    )
}

export default Login