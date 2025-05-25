import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const OrderedItemCard = ({ item }) => {
    return (
        <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        >
            <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                />
            </Link>
            <div className="ml-4 flex-1">
                <Link
                    to={`/product/${item.productId}`}
                    className="text-gray-900 hover:text-primary transition-colors duration-200"
                >
                    {item.name}
                </Link>
                <p className="text-gray-500 text-sm mt-1">
                    Quantity: {item.quantity}
                </p>
            </div>
            <div className="text-gray-900 font-medium">
                ₹{(item.price * item.quantity).toFixed(2)}
            </div>
        </motion.div>
    )
}

export default OrderedItemCard