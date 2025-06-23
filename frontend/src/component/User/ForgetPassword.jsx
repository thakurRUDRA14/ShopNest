import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, forgetPassword } from "../../slices/userSlice.js";
import AuthForm from "./AuthForm.jsx";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const { error, message, user } = useSelector((state) => state.userData)
  const [formData, setFormData] = useState({
    email: "",
  })

  const handleInputChange = (e) => {
    setFormData({ [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgetPassword(formData));
  };

  useEffect(() => {
    if (user) {
      setFormData({ email: user.email })
    }
    if (message) {
      toast.success(message);
    }
  }, [dispatch, message]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch])

  return (
    <>
      <MetaData title="Forget Password -- ShopNest" />
      <div className="w-full max-w-md mx-auto h-screen flex items-center justify-center p-4">
        <AuthForm
          type="forgetPassword"
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default ForgetPassword;
