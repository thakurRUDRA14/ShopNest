import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../../slices/userSlice';
import { useState } from 'react';
import Profile from "../../../assets/Profile.png";
import AuthForm from './AuthForm';

const Register = () => {
    const dispatch = useDispatch();
    const [avatarPreview, setAvatarPreview] = useState(Profile);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        avatar: "",
    })
    
    const { loading } = useSelector(state => state.userData);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(formData));
    };

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

    return (
        <AuthForm
            type="register"
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={loading}
            avatarPreview={avatarPreview}
        />
    )
}

export default Register