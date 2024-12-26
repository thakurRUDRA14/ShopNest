import React, { useEffect } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

const ConfirmOrder = () => {

  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cartData);
  const { user, isAuthenticated } = useSelector((state) => state.userData);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 500 ? 0 : 199;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/order/payment");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/order/confirm");
    }
  }, [isAuthenticated, navigate])

  return (
    (isAuthenticated &&
      <>
        <MetaData title="Confirm Order" />
        <CheckoutSteps activeStep={1} />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 bg-white p-16">

          <div className="space-y-6  lg:border-r p-8">
            <div>
              <Typography variant="h5" className="font-bold">
                Shipping Info
              </Typography>
              <div className="space-y-4 p-6">
                <div className="flex">
                  <p className="font-medium text-gray-700">Name:</p>
                  <span className="ml-4 text-gray-500">{user.name}</span>
                </div>
                <div className="flex">
                  <p className="font-medium text-gray-700">Phone:</p>
                  <span className="ml-4 text-gray-500">{shippingInfo.phoneNo}</span>
                </div>
                <div className="flex">
                  <p className="font-medium text-gray-700">Address:</p>
                  <span className="ml-4 text-gray-500">{address}</span>
                </div>
              </div>
            </div>
            <div>
              <Typography variant="h5" className="font-bold">
                Your Cart Items:
              </Typography>
              <div className="max-h-80 overflow-y-auto space-y-4 p-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between">
                    <img
                      src={item.image}
                      alt="Product"
                      className="w-12 h-12 object-cover"
                    />
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-gray-800 font-normal hover:text-gray-600 w-1/2 text-base"
                    >
                      {item.name}
                    </Link>
                    <span className="text-gray-500">
                      {item.quantity} X ₹{item.price} ={" "}
                      <b className="text-gray-700">₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="p-10 border-gray-300 space-y-6">
              <Typography variant="h5" className="font-semibold text-center">
                Order Summary
              </Typography>
              <div className="space-y-4 py-4 border-y">
                <div className="flex justify-between">
                  <p>Subtotal:</p>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <p>Shipping Charges:</p>
                  <span>₹{shippingCharges}</span>
                </div>
                <div className="flex justify-between">
                  <p>GST:</p>
                  <span>₹{tax}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Total:</p>
                <span className="font-semibold">₹{totalPrice}</span>
              </div>
              <button
                onClick={proceedToPayment}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Proceed To Payment
              </button>
            </div>
          </div>
        </div>
      </>)
  );
};

export default ConfirmOrder;
