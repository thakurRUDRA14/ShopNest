import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import { clearErrors, getOrderDetails } from "../../slices/orderSlice";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import OrderedItemCard from "./OrderedItemCard";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { orderDetails, error, loading } = useSelector((state) => state.orderData);
  const { isAuthenticated } = useSelector((state) => state.userData);
  const order = orderDetails;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/order/${id}`);
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, id, isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch])

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-700">
          Please log in to view your order details.
        </h2>
      </div>
    );
  }
  if (loading) {
    return <Loader />;
  }
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-700">
          Order not found.
        </h2>
      </div>
    );
  }

  return (
    <>
      <MetaData title="Order Details -- ShopNest" />
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden"
        >
          {/* Order Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary px-6 py-4"
          >
            <h1 className="flex flex-col justify-between sm:flex-row text-2xl font-bold text-white">
              <span>Order Details</span> <span className="text-gray-300 text-sm">#{order._id}</span>
            </h1>
            <p className="text-gray-300 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </motion.div>

          <div className="p-6 space-y-8">
            {/* Shipping Info */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Shipping Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-24 font-medium text-gray-700">Name:</span>
                  <span className="text-gray-600">{order.user && order.user.name}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-24 font-medium text-gray-700">Phone:</span>
                  <span className="text-gray-600">
                    {order.shippingInfo && order.shippingInfo.phoneNo}
                  </span>
                </div>
                <div className="flex gap-7 sm:gap-0 items-start">
                  <span className="w-24 font-medium text-gray-700">Address:</span>
                  <span className="text-gray-600">
                    {order.shippingInfo &&
                      `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                  </span>
                </div>
              </div>
            </motion.section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
              {/* Payment Info */}
              <motion.section
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
                className="bg-gray-100 p-4 rounded-lg"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Payment Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-24 font-medium text-gray-700">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${order.paymentInfo.status === "succeeded"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"}`}
                    >
                      {order.paymentInfo.status === "succeeded" ? "PAID" : "NOT PAID"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-24 font-medium text-gray-700">Amount:</span>
                    <span className="text-gray-600">₹{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </motion.section>

              {/* Order Status */}
              <motion.section
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
                className="bg-gray-100 p-4 rounded-lg"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Order Status
                </h2>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </motion.section>
            </div>

            {/* Order Items */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
              className="border-t border-gray-200 pt-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Items
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.orderItems &&
                  order.orderItems.map((item, index) => (
                    <div key={item._id} >
                      <OrderedItemCard item={item} />
                    </div>
                  ))}
              </div>
            </motion.section>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-primary text-white p-4 rounded-lg"
            >
              <div className="flex justify-between text-lg font-medium">
                <span>Total Amount:</span>
                <span>₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>

  );
};

export default OrderDetails;