import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, IconButton, Typography } from "@mui/material";
import MetaData from "../../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { clearErrors, deleteUser, getAllUsers, resetOperationStatus } from "../../../slices/adminSlice";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, users, operationSuccess, message } = useSelector((state) => state.adminData);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (operationSuccess) {
      toast.success(message);
      navigate("/admin/users");
      dispatch(resetOperationStatus());
    }

    dispatch(getAllUsers());
  }, [dispatch, error, operationSuccess]);

  const columns = [
    {
      field: "avatar",
      headerName: "Avatar",
      minWidth: 60,
      flex: 0.2,
      renderCell: (rows) => (
        <Avatar
          src={rows.row.avatar}
          alt={rows.row.name}
          sx={{ width: 40, height: 40 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "../../images/Profile.png";
          }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 0.5,
    },
    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 70,
      flex: 0.3,
      cellClassName: (rowData) => {
        return rowData.row.role === "admin" ? "text-green-600" : "text-red-600";
      },
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "id",
      headerName: "User ID",
      minWidth: 150,
      flex: 0.8
    },


    {
      field: "actions",
      headerName: "Actions",
      minWidth: 108,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex justify-end">
            <IconButton
              component={Link}
              to={`/admin/user/${params.row.id}`}
              aria-label="Edit User"
              className="text-blue-600 hover:text-blue-800"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => deleteUserHandler(params.row.id)}
              aria-label="Delete User"
              className="text-red-600 hover:text-red-800"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((user) => {
      rows.push({
        avatar: user.avatar.url,
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      });
    });

  return (
    <>
      <MetaData title="ALL USERS - Admin" />
      <div className="flex flex-col items-center p-5 bg-gray-50 min-h-screen">
        <Typography
          variant="h4"
          className="mb-6 font-bold text-gray-700 text-center"
        >
          All Users
        </Typography>
        {rows.length > 0 ? (
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-4">
            <DataGrid
              rows={rows}
              columns={columns}
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 15, 20]}
              disableSelectionOnClick
              className="rounded-lg"
            />
          </div>
        ) : (
          <Typography
            variant="h6"
            className="mt-10 text-gray-500 text-center"
          >
            {loading ? "Fetching Users..." : " No User Available"}
          </Typography>
        )}
      </div>
    </>
  );
};

export default UsersList;
