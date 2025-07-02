import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { GiEmptyHourglass } from 'react-icons/gi';
import { FaFire } from 'react-icons/fa';
import { IoMdRibbon } from 'react-icons/io';
import { MdPayments } from 'react-icons/md';
import { FiShoppingCart } from 'react-icons/fi';
import StarRating from "./StarRating";
import { useDispatch } from "react-redux";
import { addToCart } from "../../slices/cartSlice";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const productId = product._id;

  const addToCartHandler = () => {
    dispatch(addToCart({ productId, quantity: 1 }));
    toast.success("Item Added To Cart");
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const cardVariants = {
    initial: { scale: 1, rotateX: 0 },
    hover: {
      scale: 1.03,
      rotateX: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.04 },
    duration: 0.4
  };

  const buttonVariants = {
    initial: { scale: 1, backgroundColor: "#f3f4f6" },
    hover: {
      scale: 1.05,
      backgroundColor: "#1E40AF",
      color: "white",
      transition: { duration: 0.2 }
    }
  };

  const buyNowVariants = {
    initial: { scale: 1, opacity: 0, y: 0 },
    hover: {
      opacity: 1,
      y: -28,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="group relative h-full "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      variants={cardVariants}
      whileHover="hover"
    >
      <motion.div
        layoutId={`product-${product._id}`}
        className="flex justify-center h-full min-w-fit gap-2 lg:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
        whileHover="hover"
      >
        {/* Product Image */}
        <Link
          to={`/product/${product._id}`}
          className="block relative overflow-hidden flex-shrink-0 w-40 lg:w-full"
        >
          <div className="relative pb-[100%] overflow-hidden">
            <motion.img
              src={product.images?.[0]?.url || '/placeholder-product.jpg'}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              variants={imageVariants}
              initial="initial"
              whileHover="hover"
            />
          </div>

          {/* Badge */}
          {product.stock < 50 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {product.stock < 10 ? <><GiEmptyHourglass className="inline-block mr-1" />Low Stock</> : <><FaFire className="inline-block mr-1" />Selling Fast</>}
            </div>
          )}

          {new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              <IoMdRibbon className="inline-block mr-1" />New
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="flex flex-col justify-center w-full lg:w-auto p-4">
          <Link to={`/product/${product._id}`} className="flex justify-between items-start mb-1">
            <h3 className="text-gray-800 font-medium text-sm md:text-base line-clamp-2 flex-1">
              {product.name}
            </h3>
            <span className="font-bold text-primary text-lg ml-2">
              ₹{product.price.toLocaleString()}
            </span>
          </Link>

          {/* Rating and Reviews */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <StarRating rating={product.ratings} />
              <span className="text-xs text-gray-500 ml-1">
                ({product.numberOfReviews})
              </span>
            </div>
            <span className="text-xs text-gray-400 ml-auto">
              {formatDate(product.updatedAt)}
            </span>
          </div>

          {/* Category and Quick Actions */}
          <div className="flex gap-1 justify-between items-center mt-3">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full line-clamp-1">
              {product.category}
            </span>

            <motion.div
              className="flex gap-2 relative"
              initial="initial"
              whileHover="hover"
            >
              {/* <motion.button
                disabled={product.stock === 0}
                className={`absolute sm:block text-xs bg-primary text-white px-3 py-1 rounded-full ${product.stock === 0 ? 'cursor-not-allowed' : ''}`}
                onClick={addToCartHandler}
                variants={buyNowVariants}
              >
                <MdPayments className="inline-block mr-1" />Buy Now
              </motion.button> */}
              <motion.button
                disabled={product.stock === 0}
                className={`text-xs min-w-28 bg-gray-200 text-gray-700 px-3 py-1 rounded-full ${product.stock === 0 ? 'cursor-not-allowed' : ''}`}
                onClick={addToCartHandler}
                variants={buttonVariants}
              >
                <FiShoppingCart className="inline-block mr-1" />Add to Cart
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;