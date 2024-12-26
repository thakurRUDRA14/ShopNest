import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData.jsx";
import Loader from "../layout/Loader/Loader.jsx";
import { useNavigate } from "react-router";
import { clearErrors, resetUpdateStatus, updatePassword } from "../../slices/userSlice.js";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { error, isUpdated, loading, isAuthenticated } = useSelector((state) => state.userData);

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const updatePasswordForm = {
      oldPassword,
      newPassword,
      confirmPassword
    }
    dispatch(updatePassword(updatePasswordForm));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast("Password Updated Successfully");
      dispatch(resetUpdateStatus());
      navigate("/me");
    }
  }, [dispatch, navigate, toast, error, isUpdated, isAuthenticated]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Update Password" />
          <div className="flex items-center justify-center w-screen h-screen bg-gray-100 fixed inset-0">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg overflow-hidden">
              <h2 className="text-xl font-normal text-gray-600 text-center border-b pb-3 mb-4">
                Update Password
              </h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={updatePasswordSubmit}
              >
                <div className="flex items-center relative">
                  <VpnKeyIcon className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    placeholder="Old Password"
                    required
                    name="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-red-200"
                  />
                </div>
                <div className="flex items-center relative">
                  <LockOpenIcon className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                  Update
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdatePassword;
