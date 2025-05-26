import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { clearErrors, myOrders } from "../../slices/orderSlice";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import OrderedItemPreviewCard from "./OrderedItemsPreviewCard";
import Pagination from "../Product/Pagination";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, orders, ordersCount, resultPerPage } = useSelector((state) => state.orderData);
  const { isAuthenticated, user } = useSelector((state) => state.userData);

  const totalPages = Math.ceil(ordersCount / resultPerPage);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?=/orders");
    }
    dispatch(myOrders(currentPage));
  }, [dispatch, isAuthenticated, currentPage, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <>
      {isAuthenticated && (
        <>
          <MetaData title={`${user.name}'s - Orders`} />
          <div className="min-h-screen w-full flex justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto w-full"
            >
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">
                  Your Orders
                </h1>
              </div>

              {loading ? (
                <Loader />
              ) : orders && orders.length > 0 ? (
                <div>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4 p-2 sm:p-0"
                  >
                    {orders.map((order, index) => (
                      <motion.div
                        key={order._id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        className="overflow-hidden"
                      >
                        <OrderedItemPreviewCard
                          order={order}
                          layoutId={`order-${order._id}`}
                        />
                      </motion.div>
                    ))}
                  </motion.div>


                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12">
                      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                    </div>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="mx-auto h-24 w-24 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No orders found
                  </h3>
                  <p className="mt-1 text-gray-500">
                    You haven't placed any orders yet.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/products"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </>
  );
};

export default MyOrders;