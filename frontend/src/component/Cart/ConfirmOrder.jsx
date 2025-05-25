import { useEffect } from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";

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
    navigate("/payment");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/confirmOrder");
    }
    if (!cartItems.length) {
      navigate("/cart");
    }

  }, [isAuthenticated, cartItems, navigate]);

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    isAuthenticated && (
      <>
        <MetaData title="Confirm Order -- SHOPNEST" />

        <motion.div
          layoutId="checkout-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4  py-8 mb-5 grid grid-cols-1 lg:grid-cols-[2fr_1.5fr] gap-2 bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Left Column - Shipping Info and Cart Items */}
          <div className="space-y-8 p-6 lg:p-8 lg:border-r border-gray-200">
            {/* Shipping Info */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Shipping Info
              </h2>
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex">
                  <p className="font-medium text-gray-700 w-24">Name:</p>
                  <span className="text-gray-600">{user.name}</span>
                </div>
                <div className="flex">
                  <p className="font-medium text-gray-700 w-24">Phone:</p>
                  <span className="text-gray-600">{shippingInfo.phoneNo}</span>
                </div>
                <div className="flex">
                  <p className="font-medium text-gray-700 w-24">Address:</p>
                  <span className="text-gray-600">{address}</span>
                </div>
              </div>
            </motion.div>

            {/* Cart Items */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Your Cart Items
              </h2>
              <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.productId}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <img
                      src={item.image}
                      alt="Product"
                      className="w-16 h-16 object-contain rounded"
                    />
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-gray-800 font-medium hover:text-indigo-600 flex-1 px-4 text-base transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <span className="flex flex-col sm:flex-row text-gray-600 whitespace-nowrap">
                      <p className="text-xs sm:text-base">{item.quantity} × ₹{item.price}</p>
                      <p className="hidden sm:inline-block mx-1">=</p>
                      <b className="text-gray-800">₹{item.price * item.quantity}</b>
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/*Order Summary */}
          <motion.div
            layoutId="order-summary"
            className="p-6 lg:p-8 bg-gray-50 lg:bg-white"
          >
            <div className="sticky top-8 space-y-6 p-6 bg-white rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Order Summary
              </h2>
              <div className="space-y-4 py-4 border-y border-gray-200">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal:</p>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping Charges:</p>
                  <span className="font-medium">₹{shippingCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax (18%):</p>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg">
                <p className="font-semibold text-gray-800">Total:</p>
                <span className="font-bold text-indigo-600">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
              <motion.button
                onClick={proceedToPayment}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-md transition-all"
              >
                Proceed To Payment
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </>
    )
  );
};

export default ConfirmOrder;