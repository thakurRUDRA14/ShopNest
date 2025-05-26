import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { clearErrors, resetUpdateStatus, updatePassword } from "../../slices/userSlice.js";
import MetaData from "../layout/MetaData.jsx";
import AuthForm from "./AuthForm.jsx";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { error, isUpdated, isAuthenticated } = useSelector((state) => state.userData);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePassword(formData));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name === "password" ? "newPassword" : name]: value
    }))
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    if (isUpdated) {
      toast("Password Updated Successfully");
      dispatch(resetUpdateStatus());
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
      <>
        <MetaData title="Update Password" />
        <div className="w-full max-w-md mx-auto h-screen flex items-center justify-center p-4">
          <AuthForm
            type="updatePassword"
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </>
    </>
  );
};

export default UpdatePassword;
