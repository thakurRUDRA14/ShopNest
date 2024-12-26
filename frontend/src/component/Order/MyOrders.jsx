import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import MetaData from "../layout/MetaData";
import LaunchIcon from "@mui/icons-material/Launch";
import { clearErrors, myOrders } from "../../slices/orderSlice";
import { toast } from "react-toastify";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, orders } = useSelector((state) => state.orderData);
  const { isAuthenticated, user } = useSelector((state) => state.userData);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (rowData) => {
        return rowData.row.status === "DELIVERED"
          ? "text-green-500"
          : "text-red-500";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      filterable: false,
      renderCell: (rowData) => (
        <Link to={`/order/${rowData.row.id}`}>
          <LaunchIcon className="text-blue-500 hover:text-blue-700 transition duration-200" />
        </Link>
      ),
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

  useEffect(() => {

    if (!isAuthenticated) {
      navigate("/login?=/orders");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders());
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <>
      {isAuthenticated && (
        <>
          <MetaData title={`${user.name} - Orders`} />
          <div className="w-full max-w-full p-4 bg-gray-200 h-screen flex flex-col overflow-y-auto">
            <Typography
              variant="h5"
              className="text-center text-white bg-gray-800 p-2"
            >
              {user.name}'s Orders
            </Typography>
            {rows.length > 0 ? (
              <div className="w-full bg-white rounded-lg shadow-lg p-4 mt-4">
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  disableSelectionOnClick
                  className="text-sm text-gray-800"
                  autoHeight
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "tomato",
                      color: "black",
                      fontSize: "1rem",
                      fontWeight: "bold",
                    },
                    "& .MuiDataGrid-cell": {
                      border: "none",
                      fontSize: "0.875rem",
                    },
                    "& .MuiDataGrid-iconSeparator": {
                      display: "none",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                      whiteSpace: "normal",
                      lineHeight: "1.5",
                    },
                  }}
                />
              </div>
            ) : (
              <Typography
                variant="h6"
                className="mt-10 text-gray-500 text-center"
              >
                {loading ? "Fetching Orders..." : " No Order Found"}
              </Typography>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MyOrders;
