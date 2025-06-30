import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, loadUser, updateProfile, resetUpdateStatus } from "../../slices/userSlice.js";
import AuthForm from "./AuthForm.jsx";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { error, isUpdated, user, isAuthenticated } = useSelector((state) => state.userData);

  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: null,
  })

  const handleInputChange = (e, previewUrl) => {
    if (e.target.name === "avatar") {
      setAvatarPreview(previewUrl);
    }
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData to properly handle file upload
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);

    if (formData.avatar) {
      typeof (formData.avatar) === "string" ? formDataToSend.append('avatar', formData.avatar) : formDataToSend.append('avatar', formData.avatar, 'avatar.jpg');
    }

    dispatch(updateProfile(formDataToSend));
  };

  useEffect(() => {

    if (!isAuthenticated) {
      navigate("/login");
    }

    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        avatar: user.avatar.url,
      })
      setAvatarPreview(user.avatar.url);
    }

    if (isUpdated) {
      toast("Profile Updated Successfully");
      dispatch(resetUpdateStatus());
      dispatch(clearErrors());
      dispatch(loadUser())
      navigate("/me");
    }
  }, [dispatch, navigate, isUpdated, isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch])

  return (
    <>
      <MetaData title="Update Profile -- ShopNest" />
      <div className="w-full max-w-md mx-auto flex items-center justify-center p-4">
        <AuthForm
          type="updateUser"
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          avatarPreview={avatarPreview}
        />
      </div>
    </>
  );
};

export default UpdateProfile;
