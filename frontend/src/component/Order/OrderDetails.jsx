import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import Loader from "../layout/Loader/Loader";
import { clearErrors, getOrderDetails } from "../../slices/orderSlice";
import { toast } from "react-toastify";

const OrderDetails = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);

  const { orderDetails, error, loading } = useSelector((state) => state.orderData);
  const { isAuthenticated } = useSelector((state) => state.userData);
  const order = orderDetails;
  console.log(order, error, loading);

  useEffect(() => {
    console.log("hello");
    if (!isAuthenticated) {
      navigate(`/login?redirect=/order/${id}`);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(getOrderDetails(id));

  }, [dispatch, error, id, isAuthenticated, navigate]);

  return (
    <>
      {loading ?
        <Loader />
        : isAuthenticated && order && (
          <>
            <MetaData title="Order Details" />
            <div className="bg-white min-h-screen">
              <div className="p-20 pb-0">
                <Typography component="h1" className="text-3xl font-light text-tomato my-16">
                  Order #{order && order._id}
                </Typography>
                <Typography className="text-xl font-medium">Shipping Info</Typography>
                <div className="my-8">
                  <div className="flex mb-4">
                    <p className="text-lg font-medium text-black">Name:</p>
                    <span className="ml-4 text-gray-600">{order.user && order.user.name}</span>
                  </div>
                  <div className="flex mb-4">
                    <p className="text-lg font-medium text-black">Phone:</p>
                    <span className="ml-4 text-gray-600">
                      {order.shippingInfo && order.shippingInfo.phoneNo}
                    </span>
                  </div>
                  <div className="flex mb-4">
                    <p className="text-lg font-medium text-black">Address:</p>
                    <span className="ml-4 text-gray-600">
                      {order.shippingInfo &&
                        `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                    </span>
                  </div>
                </div>
                <Typography className="text-xl font-medium">Payment</Typography>
                <div className="my-8">
                  <div>
                    <p
                      className={`${order.paymentInfo.status === "succeeded"
                        ? "text-green-500"
                        : "text-red-500"
                        } text-lg font-medium`}
                    >
                      {order.paymentInfo.status === "succeeded" ? "PAID" : "NOT PAID"}
                    </p>
                  </div>
                  <div className="flex mt-4">
                    <p className="text-lg font-medium text-black">Amount:</p>
                    <span className="ml-4 text-gray-600">{order.totalPrice}</span>
                  </div>
                </div>

                <Typography className="text-xl font-medium">Order Status</Typography>
                <div className="my-8">
                  <p
                    className={`${order.orderStatus === "Delivered" ? "text-green-500" : "text-red-500"
                      } text-lg font-medium`}
                  >
                    {order.orderStatus}
                  </p>
                </div>
              </div>

              <div className="p-8 border-t border-gray-300">
                <Typography className="text-xl font-medium mb-4">Order Items:</Typography>
                <div>
                  {order.orderItems &&
                    order.orderItems.map((item) => (
                      <div key={item.product} className="flex items-center my-8">
                        <img
                          src={item.image}
                          alt="Product"
                          className="w-12 h-12 object-cover rounded"
                        />
                        <Link
                          to={`/product/${item.product}`}
                          className="mx-8 text-gray-600 text-lg hover:underline"
                        >
                          {item.name}
                        </Link>
                        <span className="text-gray-600">
                          {item.quantity} X ₹{item.price} ={" "}
                          <b className="text-black">₹{item.price * item.quantity}</b>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
    </>
  );
};

export default OrderDetails;
