import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import MetaData from "../../layout/MetaData";
import { MailOutline, Face, VerifiedUser } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import {
  clearErrors,
  getAnyUser,
  resetOperationStatus,
  updateUser,
} from "../../../slices/adminSlice";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { loading, error, user, operationSuccess, message } = useSelector(
    (state) => state.adminData
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getAnyUser(userId));
    } else {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setRole(user?.role || "");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (operationSuccess) {
      toast.success(message);
      navigate("/admin/users");
      dispatch(resetOperationStatus());
    }
  }, [dispatch, error, operationSuccess, user, userId, navigate]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const updateUserForm = new FormData();
    updateUserForm.set("name", name);
    updateUserForm.set("email", email);
    updateUserForm.set("role", role);

    dispatch(updateUser({ userId, updateUserForm }));
  };

  return (
    <>
      <MetaData title="Update User" />
      <div className="flex flex-col items-center bg-gray-100 w-full min-h-screen border-l border-gray-300 p-8">

        <form
          className="bg-white shadow-md rounded-xl w-full max-w-lg p-8 space-y-6"
          onSubmit={updateUserSubmitHandler}
        >
          <h1 className="text-center text-3xl font-semibold text-gray-800">
            Update User
          </h1>

          <div className="relative flex items-center">
            <Face className="absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <div className="relative flex items-center">
            <MailOutline className="absolute left-3 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <div className="relative flex items-center">
            <VerifiedUser className="absolute left-3 text-gray-500" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            >
              <option value="" disabled>
                Choose Role
              </option>
              <option unselectable={`${user?.role === "admin"}`} value="admin">Admin</option>
              <option unselectable={`${user?.role === "user"}`} value="user">User</option>
            </select>
          </div>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading || !role || role == user?.role}
            className="w-full"
          >
            {loading ? "Updating..." : "Update User"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default UpdateUser;
