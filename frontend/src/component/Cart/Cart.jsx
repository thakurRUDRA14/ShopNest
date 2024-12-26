import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import CartItemCard from "./CartItemCard.jsx";
import { changeInCart, removeFromCart } from "../../slices/cartSlice.js";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cartData);

  const increaseQuantity = (productId, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
    dispatch(changeInCart({ productId, quantity: newQty }));
  };
  const decreaseQuantity = (productId, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    dispatch(changeInCart({ productId, quantity: newQty }));
  };

  const deleteCartItems = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/order/shipping");
  };

  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 90) {
        setScroll(true)
      }
      else {
        setScroll(false)
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [])

  return (
    <>
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 ">
          <RemoveShoppingCartIcon className="text-red-500 text-6xl" />
          <Typography variant="h6" className="text-lg">No Product in Your Cart</Typography>
          <Link to="/products" className="bg-gray-800 text-white py-2 px-6 mt-4 rounded-full">
            View Products
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <div className="py-10 w-11/12">
              <div className={`grid grid-cols-2 bg-red-500 text-white px-10 py-6 mb-8 font-light sticky top-5 rounded-md ${scroll ? "z-50" : ""}`}>
                <p>Product</p>
                <div className="grid grid-cols-3 text-end">
                  <p>Quantity</p>
                  <div></div>
                  <p>Subtotal</p>
                </div>
              </div>

              {cartItems &&
                cartItems.map((item) => (
                  <div className="grid grid-cols-2 gap-4 p-4 border-b" key={item.productId}>
                    <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                    <div className="grid grid-cols-2 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() =>
                            decreaseQuantity(item.productId, item.quantity)
                          }
                          className="bg-gray-600 text-white py-1 mr-2 w-7 rounded-md"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          readOnly
                          className="w-8 border-none border-gray-400 rounded"
                        />
                        <button
                          onClick={() =>
                            increaseQuantity(item.productId, item.quantity, item.stock)
                          }
                          className="bg-gray-600 text-white py-1 w-7 rounded-md"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-right text-lg font-medium text-gray-700">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}

              <div className="grid grid-cols-2 items-center justify-between mt-6">
                <div></div>
                <div className="flex justify-between items-center p-4 bg-gray-100 rounded">
                  <p className="text-xl font-medium">Gross Total</p>
                  <p className="text-xl font-medium">
                    ₹{cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}
                  </p>
                </div>
                <div></div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={checkoutHandler}
                    className="bg-red-500 text-white py-1 px-6 rounded-2xl text-lg font-medium hover:bg-red-600"
                  >
                    Check Out
                  </button>
                </div>
              </div>
            </div></div>
        </>
      )}
    </>
  );
};

export default Cart;
