import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData.jsx";
import Loader from "../layout/Loader/Loader.jsx";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.userData);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${user?.name || "User"}'s Profile`} />
          <div className="flex h-screen w-full fixed top-0 left-0 bg-white">
            <div className="flex flex-col items-center justify-center w-1/2 space-y-6">
              <h1 className="text-gray-600 font-medium text-3xl transform -translate-x-40 -translate-y-8">
                My Profile
              </h1>
              <img
                src={user?.avatar?.url || "/default-avatar.png"}
                alt={user?.name || "User"}
                className="w-40 h-40 rounded-full transition-transform duration-500 hover:scale-105"
              />
              <Link
                to="/me/update"
                className="bg-red-600 text-white font-normal text-sm py-2 px-4 rounded w-1/3 text-center hover:bg-red-700 transition-colors"
              >
                Edit Profile
              </Link>
            </div>
            <div className="flex flex-col justify-evenly items-start w-1/2 p-20 space-y-4">
              <div>
                <h4 className="text-black font-medium text-lg">Full Name</h4>
                <p className="text-gray-500 font-normal text-base">{user?.name || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-black font-medium text-lg">Email</h4>
                <p className="text-gray-500 font-normal text-base">{user?.email || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-black font-medium text-lg">Joined On</h4>
                <p className="text-gray-500 font-normal text-base">
                  {user?.createdAt ? String(user.createdAt).substr(0, 10) : "N/A"}
                </p>
              </div>
              <div className="flex flex-col space-y-4 w-3/5">
                <Link
                  to="/orders"
                  className="bg-gray-800 text-white font-normal text-sm py-2 px-4 rounded text-center hover:bg-gray-900 transition-colors"
                >
                  My Orders
                </Link>
                <Link
                  to="/password/update"
                  className="bg-gray-800 text-white font-normal text-sm py-2 px-4 rounded text-center hover:bg-gray-900 transition-colors"
                >
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
