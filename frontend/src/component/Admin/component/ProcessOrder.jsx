import React, { useEffect, useState } from "react";
import MetaData from "../../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { Typography, Button, CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { toast } from "react-toastify";
import {
  clearErrors as clearUpdateErrors,
  resetOperationStatus,
  updateOrder,
} from "../../../slices/adminSlice";
import { clearErrors, getOrderDetails } from "../../../slices/orderSlice";

const ProcessOrder = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { orderDetails: order, error } = useSelector((state) => state.orderData);
  const { error: updateError, operationSuccess, message, loading } = useSelector((state) => state.adminData);

  const [status, setStatus] = useState("");

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    const updateOrderForm = new FormData();
    updateOrderForm.set("status", status);
    dispatch(updateOrder({ orderId, updateOrderForm }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearUpdateErrors());
    }
    if (operationSuccess) {
      toast.success(message);
      dispatch(resetOperationStatus());
    }

    dispatch(getOrderDetails(orderId));
  }, [dispatch, error, updateError, operationSuccess, orderId]);

  return (
    <>
      <MetaData title="Process Order" />
      <div className="grid gap-8 lg:grid-cols-2 p-6 md:p-8">

        {/* Shipping Info */}
        <div className="space-y-6">

          <div className="space-y-4">
            <Typography variant="h6" className="text-gray-800 font-semibold">Shipping Info</Typography>
            <div className="border p-4 rounded-lg bg-white shadow-sm">
              <p className="text-gray-700"><strong>Name:</strong> {order?.user?.name} </p>
              <p className="text-gray-700"><strong>Phone:</strong> {order?.shippingInfo?.phoneNo} </p>
              <p className="text-gray-700"><strong>Address:</strong> {order?.shippingInfo && `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`} </p>
            </div>
          </div>

          <div className="space-y-4">
            <Typography variant="h6" className="text-gray-800 font-semibold">Payment</Typography>
            <div className="border p-4 rounded-lg bg-white shadow-sm">

              <p className="text-gray-700">
                <strong>Status:</strong> <span className={`font-bold ${order?.paymentInfo?.status === "succeeded" ? "text-green-600" : "text-red-600"}`}>
                  {order?.paymentInfo?.status === "succeeded" ? "PAID" : "NOT PAID"}
                </span>
              </p>

              <p className="text-gray-700">
                <strong>Amount:</strong> {`₹${order?.totalPrice}`}
              </p>

            </div>
          </div>

          <div className="space-y-4">
            <Typography variant="h6" className="text-gray-800 font-semibold">Order Status</Typography>
            <div className="border p-4 rounded-lg bg-white shadow-sm">
              <span
                className={`font-bold text-lg ${order?.orderStatus === "PENDING"
                  ? "text-gray-600"
                  : order?.orderStatus === "CANCELLED"
                    ? "text-red-600"
                    : order?.orderStatus === "PROCESSING"
                      ? "text-blue-600"
                      : order?.orderStatus === "SHIPPED"
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
              >
                {order?.orderStatus}
              </span>
            </div>
          </div>


          {order?.orderStatus !== "Delivered" && (
            <div className="space-y-4">
              <Typography variant="h6" className="text-gray-800 font-semibold">Process Order</Typography>
              <div className="border p-4 rounded-lg bg-white shadow-sm">
                <form onSubmit={updateOrderSubmitHandler} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <AccountTreeIcon className="text-gray-500" />
                    <select
                      className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-500"
                      onChange={(e) => setStatus(e.target.value)}
                      defaultValue={order?.orderStatus}
                    >
                      <option value="" disabled>Choose Status</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading || !status || status === order?.orderStatus}
                  >
                    {loading ? "Updating...." : "Update Status"}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div>
          <div className="space-y-4">
            <Typography variant="h6" className="text-gray-800 font-semibold">Your Cart Items</Typography>
            <div className="border p-4 rounded-lg bg-white shadow-sm">
              <div className="space-y-4">
                {order?.orderItems?.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center space-x-4 border p-4 rounded-lg bg-white shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <Link
                      to={`/product/${item.product}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {item.name}
                    </Link>
                    <p className="font-semibold">
                      {item.quantity} x ₹{item.price} ={" "}
                      <span className="font-bold">₹{item.quantity * item.price}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcessOrder;
