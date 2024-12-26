import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MailOutline, Face } from "@mui/icons-material";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData.jsx";
import Loader from "../layout/Loader/Loader.jsx";
import { useNavigate } from "react-router";
import { clearErrors, loadUser, updateProfile, resetUpdateStatus } from "../../slices/userSlice.js";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { error, isUpdated, user, loading, isAuthenticated } = useSelector((state) => state.userData);



  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const updateProfileSubmit = (e) => {
    e.preventDefault();

    const updateProfileForm = new FormData();

    updateProfileForm.set("name", name);
    updateProfileForm.set("email", email);
    if (avatar) {
      updateProfileForm.set("avatar", avatar);
    }
    dispatch(updateProfile(updateProfileForm));
  };

  const updateProfileDataChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(e.target.files[0]);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {

    if (!isAuthenticated) {
      navigate("/login");
    }

    if (user) {
      setName(user.name);
      setEmail(user.email);
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
  }, [dispatch, navigate, toast, user, error, isUpdated]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Update Profile" />
          <div className="flex items-center justify-center w-screen h-screen bg-gray-100 fixed inset-0">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg overflow-hidden">
              <h2 className="text-xl font-normal text-gray-600 text-center border-b pb-3 mb-4">
                Update Profile
              </h2>
              <form
                className="flex flex-col gap-4"
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
              >
                <div className="flex items-center relative">
                  <Face className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}

                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-red-200"
                  />
                </div>
                <div className="flex items-center relative">
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
                <div className="flex items-center space-x-4">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-16 h-16 rounded-full"
                  />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                    className="file:cursor-pointer file:py-2 file:px-4 file:rounded-md file:bg-gray-100 file:border-none file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
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

export default UpdateProfile;
