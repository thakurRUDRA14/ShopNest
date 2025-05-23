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
    avatar: "",
  })

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
    dispatch(updateProfile(formData));
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

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast("Profile Updated Successfully");
      dispatch(resetUpdateStatus());
      dispatch(loadUser())
      navigate("/me");
    }
  }, [dispatch, navigate, toast, error, isUpdated, isAuthenticated]);

  return (
    <>
      <MetaData title="Update Profile" />
      <div className="w-full max-w-md mx-auto h-screen flex items-center justify-center p-4">
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
