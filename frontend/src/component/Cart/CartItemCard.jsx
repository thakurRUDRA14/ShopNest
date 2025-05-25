import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";

const CartItemCard = ({ item, deleteCartItems }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-start p-3 sm:p-4 h-fit bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
    >
      <Link
        to={`/product/${item.productId}`}
        className="hover:opacity-90 flex-shrink-0"
      >
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={item.image}
          alt={item.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border border-gray-100"
        />
      </Link>

      <div className="flex flex-col ml-3 sm:ml-4 h-full justify-between flex-grow overflow-hidden">
        <Link
          to={`/product/${item.productId}`}
          className="text-gray-800 text-sm sm:text-base font-medium hover:text-primary transition-colors duration-200 line-clamp-2"
          title={item.name}
        >
          {item.name}
        </Link>
        <div className="flex items-center mt-1">
          <span className="text-gray-700 text-xs sm:text-sm font-medium">
            ₹{item.price.toLocaleString()}
          </span>
          {item.cuttedPrice && (
            <span className="text-gray-400 text-xs line-through ml-2">
              ₹{item.cuttedPrice.toLocaleString()}
            </span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => deleteCartItems(item.productId)}
          className="flex items-center text-red-500 text-xs sm:text-sm font-medium hover:text-red-600 transition-colors duration-200 w-fit"
          aria-label="Remove item"
        >
          <div className="hidden sm:inline-block mr-1">
            <DeleteIcon />
          </div>
          Remove
        </motion.button>
      </div>
    </motion.div>
  );
};

export default React.memo(CartItemCard);