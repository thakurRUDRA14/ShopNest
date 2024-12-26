import React, { useEffect, useRef } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@mui/material";
// import { useAlert } from "react-alert";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { clearErrors, createOrder } from "../../slices/orderSlice";
// import {
//   CardNumberElement,
//   CardCvcElement,
//   CardExpiryElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// import axios from "axios";
// import CreditCardIcon from "@mui/icons-material/CreditCard";
// import EventIcon from "@mui/icons-material/Event";
// import VpnKeyIcon from "@mui/icons-material/VpnKey";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const stripe = useStripe();
  // const elements = useElements();
  const payBtn = useRef(null);

  const { isAuthenticated } = useSelector((state) => state.userData);
  const { shippingInfo, cartItems } = useSelector((state) => state.cartData);
  // const { user } = useSelector((state) => state.userData);
  const { error } = useSelector((state) => state.orderData);

  // const paymentData = {
  //   amount: Math.round(orderInfo.totalPrice * 100),
  // };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
    paymentInfo: {
      id: "result.paymentIntent.id",
      status: "result.paymentIntent.status",
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // payBtn.current.disabled = true;

    try {
      // const config = {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // };
      // const { data } = await axios.post(
      //   "/api/v1/payment/process",
      //   paymentData,
      //   config
      // );

      // const client_secret = data.client_secret;

      // if (!stripe || !elements) return;

      // const result = await stripe.confirmCardPayment(client_secret, {
      //   payment_method: {
      //     card: elements.getElement(CardNumberElement),
      //     billing_details: {
      //       name: user.name,
      //       email: user.email,
      //       address: {
      //         line1: shippingInfo.address,
      //         city: shippingInfo.city,
      //         state: shippingInfo.state,
      //         postal_code: shippingInfo.pinCode,
      //         country: shippingInfo.country,
      //       },
      //     },
      //   },
      // });

      // if (result.error) {
      //   payBtn.current.disabled = false;

      //   toast.error(result.error.message);
      // } else {
      //   if (result.paymentIntent.status === "succeeded") {
      //     order.paymentInfo = {
      //       id: result.paymentIntent.id,
      //       status: result.paymentIntent.status,
      //     };

      dispatch(createOrder(order));

      navigate("/success");
      //   } else {
      //     toast.error("There's some issue while processing payment ");
      //   }
      // }
    } catch (error) {
      payBtn.current.disabled = false;
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (!isAuthenticated) {
      navigate("/login?redirect=/order/payment");
    }
  }, [dispatch, error, isAuthenticated]);

  return (
    <>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="grid place-items-center bg-white h-[65vh] mx-8">
        <form
          className="w-full max-w-md flex flex-col gap-6"
          onSubmit={submitHandler}
        >
          {/* <Typography className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-4 mx-auto text-center">
            Card Info
          </Typography> */}
          {/* <div className="flex items-center relative">
            <CreditCardIcon className="absolute left-4 text-gray-500" />
            <CardNumberElement className="w-full pl-12 p-3 border border-gray-300 rounded-md focus:outline-none" />
          </div> */}
          {/* <div className="flex items-center relative">
            <EventIcon className="absolute left-4 text-gray-500" />
            <CardExpiryElement className="w-full pl-12 p-3 border border-gray-300 rounded-md focus:outline-none" />
          </div> */}
          {/* <div className="flex items-center relative">
            <VpnKeyIcon className="absolute left-4 text-gray-500" />
            <CardCvcElement className="w-full pl-12 p-3 border border-gray-300 rounded-md focus:outline-none" />
          </div> */}
          <button
            type="submit"
            ref={payBtn}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-md transition-all disabled:bg-gray-400"
          >
            Pay - ₹{orderInfo && orderInfo.totalPrice}
          </button>
        </form>
      </div>
    </>
  );
};

export default Payment;
