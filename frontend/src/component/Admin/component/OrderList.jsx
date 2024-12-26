import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Typography } from "@mui/material";
import MetaData from "../../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import {
  clearErrors,
  deleteOrder,
  getAllOrders,
  resetOperationStatus,
} from "../../../slices/adminSlice";

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, orders, operationSuccess, message } = useSelector(
    (state) => state.adminData
  );

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (operationSuccess) {
      toast.success(message);
      navigate("/admin/orders");
      dispatch(resetOperationStatus());
    }

    dispatch(getAllOrders());
  }, [dispatch, error, operationSuccess]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 220,
      flex: 0.5,
      renderCell: (params) => (
        <span className="text-gray-700 font-medium">{params.value}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.5,
      cellClassName: (params) =>
      ({
        DELIVERED: "text-green-600 font-semibold",
        SHIPPED: "text-yellow-600 font-semibold",
        CANCELLED: "text-red-600 font-semibold",
        PROCESSING: "text-blue-600 font-semibold",
        PENDING: "text-gray-600 font-semibold",
      }[params.value] || ""),
      renderCell: (params) => (
        <span className={`capitalize ${params.cellClassName}`}>{params.value}</span>
      ),
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 50,
      flex: 0.3,
      renderCell: (params) => (
        <span className="text-gray-700 font-medium">{params.value}</span>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 200,
      flex: 0.5,
      renderCell: (params) => (
        <span className="text-gray-800 font-medium">₹{params.value}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      minWidth: 110,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <div className="flex justify-end">
          <IconButton
            component={Link}
            to={`/admin/order/${params.row.id}`}
            aria-label="Edit Order"
            className="text-blue-600 hover:text-blue-800"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => deleteOrderHandler(params.row.id)}
            aria-label="Delete Order"
            className="text-red-600 hover:text-red-800"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = orders?.map((item) => ({
    id: item._id,
    itemsQty: item.orderItems.length,
    amount: item.totalPrice,
    status: item.orderStatus,
  }));

  return (
    <>
      <MetaData title="ALL ORDERS - Admin" />
      <div className="flex flex-col items-center p-5 bg-gray-50 min-h-screen">
        <Typography
          variant="h4"
          className="mb-6 font-bold text-gray-700 text-center"
        >
          All Orders
        </Typography>
        {rows.length > 0 ? (
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-4">
            <DataGrid
              rows={rows || []}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 15, 20]}
              disableSelectionOnClick
              autoHeight
              className="bg-white rounded-lg shadow-lg"
            />
          </div>) :
          (
            <Typography
              variant="h6"
              className="mt-10 text-gray-500 text-center"
            >
              No orders available.
            </Typography>
          )}
      </div>
    </>
  );
};

export default OrderList;
