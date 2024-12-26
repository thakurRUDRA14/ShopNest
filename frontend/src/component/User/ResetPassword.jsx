import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData.jsx";
import Loader from "../layout/Loader/Loader.jsx";
import { useNavigate, useParams } from "react-router";
import { clearErrors, resetPassword, resetUpdateStatus } from "../../slices/userSlice.js";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { error, isUpdated, loading, isAuthenticated } = useSelector((state) => state.userData);

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const resetPasswordForm = {
      password,
      confirmPassword
    }
    dispatch(resetPassword({ resetPasswordForm, token }));
  };

  useEffect(() => {

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast("Password reset Successfully");
      dispatch(resetUpdateStatus());
      navigate("/login");
    }
  }, [dispatch, navigate, toast, error, isUpdated, isAuthenticated]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Reset Password" />
          <div className="flex items-center justify-center w-screen h-screen bg-gray-100 fixed inset-0">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg overflow-hidden">
              <h2 className="text-xl font-normal text-gray-600 text-center border-b pb-3 mb-4">
                Reset Password
              </h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={resetPasswordSubmit}
              >
                <div className="flex items-center relative">
                  <LockOpenIcon className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-red-200"
                  />
                </div>
                <div className="flex items-center relative">
                  <LockIcon className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-red-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-all duration-300"
                >
                  Reset
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResetPassword;
