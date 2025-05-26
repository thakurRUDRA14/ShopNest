import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import MetaData from "../layout/MetaData.jsx";
import Loader from "../layout/Loader/Loader.jsx";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit, FiLock, FiShoppingBag, FiLogOut, FiUser, FiMail, FiCalendar, FiCreditCard, FiHeart, FiSettings, FiArrowRight } from "react-icons/fi";
import { clearErrors, logout } from "../../slices/userSlice.js";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logout Successfully")
    dispatch(clearErrors());
    setShowLogoutConfirm(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, x: -20 }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title={`${user?.name || "User"}'s Profile`} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div className="p-5 sm:p-8 md:p-10">
              <motion.div layout className="flex justify-between mb-8">
                <h3 className="w-full text-base sm:text-xl md:text-2xl font-bold text-gray-800">{activeTab === "profile" ? "Profile Overview" : "Account Settings"}</h3>
                <div className="w-full flex justify-end gap-1">
                  {activeTab === "profile" ?
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`p-1 sm:p-3 rounded-full hover:shadow-lg transition-all ${activeTab === "settings" ? 'bg-white text-primary shadow-md' : 'hover:bg-indigo-500 hover:text-white'}`}
                    >
                      <FiSettings />
                    </button> :
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`p-1 sm:p-3 rounded-full hover:shadow-lg transition-all ${activeTab === "profile" ? 'bg-white text-primary shadow-md' : 'hover:bg-indigo-500 hover:text-white'}`}
                    >
                      <FiUser />
                    </button>
                  }
                  <Link
                    to="/me/update"
                    className="p-1 sm:p-3 rounded-full hover:shadow-lg hover:text-white hover:bg-primary transition-all"
                  >
                    <FiEdit />
                  </Link>

                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="p-1 sm:p-3 rounded-full hover:bg-red-500 hover:shadow-lg transition-all text-red-800 hover:text-white"
                  >
                    <FiLogOut />
                  </button>

                </div>
              </motion.div>

              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4 md:space-y-6">
                  {/* User Image */}
                  <motion.div variants={itemVariants} className="flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={user?.avatar?.url || "/default-avatar.png"}
                        alt={user?.name || "User"}
                        className="aspect-square w-24 sm:w-32 rounded-full border-4 border-white shadow-xl object-cover"
                      />
                    </motion.div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <motion.div variants={itemVariants} className="bg-gray-50 p-2 sm:p-6 rounded-xl">
                      <div className="flex items-center mb-1 sm:mb-3">
                        <div className="p-2 bg-indigo-100 rounded-full mr-4">
                          <FiUser className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">Personal Information</h4>
                      </div>
                      <div className="space-y-2.5 pl-14">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="text-gray-800 font-medium">{user?.name || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="text-gray-800 font-medium">
                            {user?.createdAt
                              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-gray-50 p-2 sm:p-6 rounded-xl">
                      <div className="flex items-center mb-1 sm:mb-3">
                        <div className="p-2 bg-indigo-100 rounded-full mr-4">
                          <FiMail className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">Contact Information</h4>
                      </div>
                      <div className="space-y-2.5 pl-14">
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="text-gray-800 font-medium line-clamp-1">{user?.email || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="text-gray-800 font-medium">
                            {user?.phoneNo || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-gray-50 p-2 sm:p-6 rounded-xl">
                      <div className="flex items-center mb-1 sm:mb-3">
                        <div className="p-2 bg-indigo-100 rounded-full mr-4">
                          <FiLock className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">Security</h4>
                      </div>
                      <div className="space-y-4 pl-14">
                        <Link
                          to="/password/update"
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          <FiLock className="mr-2" />
                          Change Password
                        </Link>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-gray-50 p-2 sm:p-6 rounded-xl">
                      <div className="flex items-center mb-1 sm:mb-3">
                        <div className="p-2 bg-indigo-100 rounded-full mr-4">
                          <FiCalendar className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">Account Activity</h4>
                      </div>
                      <div className="space-y-2.5 pl-14">
                        <div>
                          <p className="text-sm text-gray-500">Last Login</p>
                          <p className="text-gray-800 font-medium">{user?.lastLogin || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Login Location</p>
                          <p className="text-gray-800 font-medium">{user?.loginLocation || "N/A"}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Quick Actions Section */}
                  <div className="mt-12">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="p-3 bg-indigo-100 rounded-full inline-block mb-4">
                              <FiShoppingBag className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Your Orders</h4>
                            <p className="text-sm text-gray-500 mb-4">Track, return, or buy things again</p>
                          </div>
                          <Link
                            to="/orders"
                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <FiArrowRight className="h-5 w-5" />
                          </Link>
                        </div>
                        <Link
                          to="/orders"
                          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                        >
                          View Orders
                        </Link>
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="p-3 bg-pink-100 rounded-full inline-block mb-4">
                              <FiHeart className="h-6 w-6 text-pink-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Your Wishlist</h4>
                            <p className="text-sm text-gray-500 mb-4">Your saved items for later</p>
                          </div>
                          <Link
                            to="/wishlist"
                            className="text-pink-600 hover:text-pink-800 transition-colors"
                          >
                            <FiArrowRight className="h-5 w-5" />
                          </Link>
                        </div>
                        <Link
                          to="/wishlist"
                          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-pink-600 bg-pink-50 hover:bg-pink-100 transition-colors"
                        >
                          View Wishlist
                        </Link>
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
                              <FiCreditCard className="h-6 w-6 text-green-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Payment Methods</h4>
                            <p className="text-sm text-gray-500 mb-4">Manage your payment options</p>
                          </div>
                          <Link
                            to="/payment-methods"
                            className="text-green-600 hover:text-green-800 transition-colors"
                          >
                            <FiArrowRight className="h-5 w-5" />
                          </Link>
                        </div>
                        <Link
                          to="/payment-methods"
                          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          Manage Payments
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-gray-50 rounded-xl p-2 md:p-6 space-y-6"
                >
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div>
                      <h4 className="font-medium text-gray-800">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive updates about your orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div>
                      <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                      <p className="text-sm text-gray-500">Get order updates via text</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  {/* <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div>
                      <h4 className="font-medium text-gray-800">Dark Mode</h4>
                      <p className="text-sm text-gray-500">Switch to dark theme</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div> */}

                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Logout Confirmation Modal */}
        <AnimatePresence>
          {showLogoutConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl p-6 max-w-md w-full"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Logout</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Profile;