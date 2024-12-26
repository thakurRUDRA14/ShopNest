import React, { useRef, useState, useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MailOutline, LockOpen, Face } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearErrors, login, register } from "../../slices/userSlice.js";
import Profile from "../../assets/Profile.png"
const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.userData
  );
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState(Profile || "https://res.cloudinary.com/rudra-backend/image/upload/v1734907189/ShopNest/assets/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState(Profile || "https://res.cloudinary.com/rudra-backend/image/upload/v1734907189/ShopNest/assets/Profile.png");

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ loginEmail, loginPassword }));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    const userRegisterForm = new FormData();
    userRegisterForm.set("name", name);
    userRegisterForm.set("email", email);
    userRegisterForm.set("password", password);
    userRegisterForm.set("avatar", avatar);
    dispatch(register(userRegisterForm));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(e.target.files[0]);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const redirect = location.search ? location.search.split('=')[1] : "/";

  useEffect(() => {
    if (error) {
      toast.error(error);
      setCurrentTab("login");
      dispatch(clearErrors());
    }

    if (isAuthenticated && !loading) {
      navigate(redirect);
    }
  }, [dispatch, error, isAuthenticated, loading, navigate, redirect]);
  const [currentTab, setCurrentTab] = useState("login")
  const switchTabs = (e, tab) => {
    if (tab === "login") {
      setCurrentTab("login")
      switcherTab.current.classList.remove("translate-x-full");
      registerTab.current.classList.add("-translate-x-full");
      loginTab.current.classList.remove("-translate-x-full");
    }
    if (tab === "register") {
      setCurrentTab("register")
      switcherTab.current.classList.add("translate-x-full");
      registerTab.current.classList.remove("-translate-x-full");
      loginTab.current.classList.add("-translate-x-full");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-100 fixed inset-0">
          <div className="rounded-md relative bg-white w-full max-w-md shadow-lg overflow-hidden">
            <div className="flex justify-evenly items-center bg-gray-200 p-4">
              <p
                onClick={(e) => switchTabs(e, "login")}
                className={`cursor-pointer text-gray-600 hover:text-red-400 transition ${currentTab === "login" ? "text-red-500" : ""}`}
              >
                LOGIN
              </p>
              <p
                onClick={(e) => switchTabs(e, "register")}
                className={`cursor-pointer text-gray-600 hover:text-red-400 transition ${currentTab === "register" ? "text-red-500" : ""}`}
              >
                REGISTER
              </p>
              <button
                ref={switcherTab}
                className="w-1/2 h-1 bg-transparent absolute bottom-0 transition-transform duration-500"
              />
            </div>

            <form
              ref={loginTab}
              onSubmit={loginSubmit}
              className="absolute top-14 w-full flex flex-col items-center p-6 space-y-4 transform transition-transform duration-500"
            >
              <div className="flex items-center w-full">
                <MailOutline className="text-gray-400 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-red-200"
                />
              </div>
              <div className="flex items-center w-full">
                <LockOpen className="text-gray-400 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-red-200"
                />
              </div>
              <Link
                to="/password/forget"
                className="text-sm text-gray-500 hover:underline hover:text-blue-600 self-end"
              >
                Forgot Password?
              </Link>
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
              >
                Login
              </button>
            </form>

            <form
              ref={registerTab}
              onSubmit={registerSubmit}
              encType="multipart/form-data"
              className="flex flex-col items-center p-6 space-y-4 transform -translate-x-full transition-transform duration-500"
            >
              <div className="flex items-center w-full">
                <Face className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  value={name}
                  onChange={registerDataChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-red-200"
                />
              </div>
              <div className="flex items-center w-full">
                <MailOutline className="text-gray-400 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-red-200"
                />
              </div>
              <div className="flex items-center w-full">
                <LockOpen className="text-gray-400 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  name="password"
                  value={password}
                  onChange={registerDataChange}
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
                  onChange={registerDataChange}
                  className="file:cursor-pointer file:py-2 file:px-4 file:rounded-md file:bg-gray-100 file:border-none file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-all duration-300"
              >
                Register
              </button>
            </form>
          </div>
        </div>

      )}

    </>
  );
};

export default LoginSignUp;
