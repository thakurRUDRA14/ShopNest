import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MailOutline } from "@mui/icons-material";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData.jsx";
import Loader from "../layout/Loader/Loader.jsx";
import { clearErrors, forgetPassword } from "../../slices/userSlice.js";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const { error, message, loading } = useSelector((state) => state.userData)

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const resetPasswordForm = { email }
    dispatch(forgetPassword(resetPasswordForm));
  };

  useEffect(() => {

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }


  }, [dispatch, toast, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Forget Password" />
          <div className="flex items-center justify-center w-screen h-screen bg-gray-100 fixed inset-0">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg overflow-hidden">
              <h2 className="text-xl font-normal text-gray-600 text-center border-b pb-3 mb-4">
                Forget Password
              </h2>
              <form
                className="flex flex-col gap-8 items-center"
                onSubmit={resetPasswordSubmit}
              >

                <div className="flex items-center relative w-full">
                  <MailOutline className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-red-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-10/12 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-all duration-300"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ForgetPassword;
