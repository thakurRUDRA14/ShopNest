import { motion } from "motion/react";
import { format } from "date-fns";
import { Link } from "react-router";

const OrderedItemPreviewCard = ({ order }) => {
    const statusColors = {
        PROCESSING: "bg-yellow-100 text-yellow-800",
        SHIPPED: "bg-blue-100 text-blue-800",
        DELIVERED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
    };

    const statusText = {
        PROCESSING: "Processing",
        SHIPPED: "Shipped",
        DELIVERED: "Delivered",
        CANCELLED: "Cancelled",
    };

    const formatDate = (dateString) => {
        return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
            <Link to={`/order/${order._id}`} className="p-4 bg-white block">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-medium text-gray-900">
                                Order #{order._id.slice(-6).toUpperCase()}
                            </h3>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-800"
                                    }`}
                            >
                                {statusText[order.orderStatus] || order.orderStatus}
                            </span>
                        </div>

                        <p className="text-sm text-gray-500">
                            Ordered on {formatDate(order.createdAt)}
                        </p>

                        {order.deliveredAt && (
                            <p className="text-sm text-gray-500">
                                Delivered on {formatDate(order.deliveredAt)}
                            </p>
                        )}
                    </div>

                    <div className="hidden sm:inline-block text-right">
                        <p className="text-xl font-semibold text-gray-900">
                            {formatPrice(order.totalPrice)}
                        </p>
                        <p className="text-sm text-gray-500">
                            {order.orderItems.reduce(
                                (total, item) => total + item.quantity,
                                0
                            )}{" "}
                            items
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Products</h4>
                    <div className="mt-2 flex flex-wrap gap-3">
                        {order.orderItems.slice(0, 4).map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="relative"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded border"
                                />
                                {item.quantity > 1 && (
                                    <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {item.quantity}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                        {order.orderItems.length > 4 && (
                            <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-sm font-medium text-gray-500">
                                +{order.orderItems.length - 4}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
                        <div className="bg-gray-100 p-2 rounded-md">
                            <h4 className="text-sm font-medium text-gray-900">
                                Shipping Address
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                                {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                                {order.shippingInfo.state} - {order.shippingInfo.pinCode}
                            </p>
                        </div>

                        <div className="bg-gray-100 p-2 rounded-md">
                            <h4 className="text-sm font-medium text-gray-900">
                                Payment Status
                            </h4>
                            <p className="text-sm text-gray-500 capitalize">
                                {order.paymentInfo.status.toLowerCase()}
                            </p>
                            <p className="text-sm text-gray-500">
                                Paid on {formatDate(order.paidAt)}
                            </p>
                        </div>

                        <div className="bg-gray-100 p-2 rounded-md">
                            <h4 className="text-sm font-medium text-gray-900">Order Summary</h4>
                            <div className="mt-1 divide-y-2 divide-gray-100 text-sm text-gray-500">
                                <div className="flex justify-between">
                                    <span>Items:</span>
                                    <span>{formatPrice(order.itemsPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>{formatPrice(order.shippingPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax:</span>
                                    <span>{formatPrice(order.taxPrice)}</span>
                                </div>
                                <div className="flex justify-between font-medium text-gray-900">
                                    <span>Total:</span>
                                    <span>{formatPrice(order.totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default OrderedItemPreviewCard;