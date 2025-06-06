import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
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
    if (stock <= quantity) return;
    dispatch(changeInCart({ productId, quantity: newQty }));
  };

  const decreaseQuantity = (productId, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) return;
    dispatch(changeInCart({ productId, quantity: newQty }));
  };

  const deleteCartItems = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/order/shipping");
  };

  // Calculate gross total
  const grossTotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container min-h-screen bg-gray-50 pb-20">
      <AnimatePresence>
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center py-24 px-4"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            >
              <RemoveShoppingCartIcon className="text-red-500 text-6xl md:text-8xl" />
            </motion.div>
            <h2 className="text-xl md:text-2xl font-medium text-gray-800 mt-6">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mt-2 mb-6 max-w-md">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link
              to="/products"
              className="bg-primary text-white py-3 px-8 rounded-full font-medium hover:bg-blue-800 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className=" mx-auto px-4 py-8"
          >
            <motion.div
              variants={headerVariants}
              className={`flex justify-between items-center bg-primary text-white p-4 md:p-6 mb-8 rounded-lg shadow-md sticky top-16 z-10`}
            >
              <h2 className="text-lg md:text-xl font-medium">Your Shopping Cart</h2>
              <p className="text-sm md:text-base">
                {cartItems.length} {cartItems.length > 1 ? "Items" : "Item"}
              </p>
            </motion.div>

            {/* Desktop Headers */}
            <motion.div
              variants={headerVariants}
              className="hidden md:grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-t-lg"
            >
              <div className="font-medium text-gray-700">Product</div>
              <div className="flex justify-between align-middle px-8">
                <div className="font-medium text-gray-700 text-center">
                  Quantity
                </div>
                <div className="font-medium text-gray-700 text-right">
                  Subtotal
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.productId}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                  <div className="flex justify-between align-middle pr-8 pl-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => decreaseQuantity(item.productId, item.quantity)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-6 rounded-md transition-colors duration-200"
                      >
                        -
                      </motion.button>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="w-10 text-center border border-gray-300 rounded-md"
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          increaseQuantity(item.productId, item.quantity, item.stock)
                        }
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-6 rounded-md transition-colors duration-200"
                      >
                        +
                      </motion.button>
                    </div>
                    <div className="flex items-center justify-end">
                      <p className="text-lg font-medium text-gray-800">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-white rounded-lg shadow-md"
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-medium text-gray-800">Order Summary</h3>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center space-x-4 mb-4">
                    <p className="text-lg text-gray-600">Gross Total:</p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{grossTotal}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={checkoutHandler}
                    className="bg-primary hover:bg-blue-600 text-white py-2 px-6 md:py-3 lg:px-8 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Proceed to Checkout
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Cart;