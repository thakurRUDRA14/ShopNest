import React from "react";
import { Link } from "react-router-dom";

function CartItemCard({ item, deleteCartItems }) {
  return (
    <div className="flex items-start p-4 h-32">
      <Link to={`/product/${item.productId}`} className="hover:opacity-90">
        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
      </Link>

      <div className="flex flex-col ml-4">
        <Link to={`/product/${item.productId}`} className="text-gray-800 text-lg font-normal hover:text-gray-600">
          {item.name}
        </Link>
        <span className="text-gray-700 text-sm">Price: ₹{item.price}</span>
        <p
          onClick={() => deleteCartItems(item.productId)}
          className="text-red-500 text-xs cursor-pointer hover:text-red-600"
        >
          Remove
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;
