import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData.jsx";
import Loader from "../layout/Loader/Loader.jsx";
import { useNavigate, useParams } from "react-router";
import { clearErrors, resetPassword, resetUpdateStatus } from "../../slices/userSlice.js";
import AuthForm from "./AuthForm.jsx";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { error, isUpdated, loading, isAuthenticated } = useSelector((state) => state.userData);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ resetPasswordForm: formData, token }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  };

  useEffect(() => {
    if (isUpdated) {
      toast("Password reset Successfully");
      dispatch(resetUpdateStatus());
      navigate("/login");
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
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Reset Password -- ShopNest" />
          <div className="w-full max-w-md mx-auto flex items-center justify-center p-4">
            <AuthForm
              type="resetPassword"
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ResetPassword;
