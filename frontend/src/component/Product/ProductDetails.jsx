import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import MetaData from "../layout/MetaData";
import ReviewCard from "./ReviewCard.jsx";
import Loader from "../layout/Loader/Loader.jsx";
import { clearErrors as clearProductErrors, getProductDetails } from "../../slices/productSlice.js";
import { addToCart } from "../../slices/cartSlice.js";
import { newReview, clearErrors as clearReviewErrors, resetOperationStatus } from "../../slices/reviewSlice.js";
import ImageCarousel from "./ImageCarousel.jsx";
import StarRating from "./StarRating.jsx";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { productId } = useParams()
  const { productDetails, loading, error: productError } = useSelector(
    (state) => state.productsData
  );
  const { operationSuccess, error: reviewError, message } = useSelector((state) => state.reviewData)

  const product = productDetails;

  const [quantity, setQuantity] = useState(1);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const increaseQuantity = () => {
    if (product.stock > quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (1 < quantity) {
      setQuantity(quantity - 1);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ productId, quantity }));
    toast.success("Item Added To Cart");
    setQuantity(1);
  };

  const toggleReviewModal = () => {
    setOpenReviewModal(!openReviewModal);
  };

  const reviewSubmitHandler = () => {
    const reviewForm = new FormData();
    reviewForm.set("rating", rating);
    reviewForm.set("comment", comment);
    reviewForm.set("productId", productId);
    dispatch(newReview(reviewForm));
    setOpenReviewModal(false);
  };

  useEffect(() => {
    if (operationSuccess) {
      toast.success(message);
      dispatch(resetOperationStatus());
    }
    dispatch(getProductDetails(productId));
  }, [dispatch, productId, operationSuccess]);

  useEffect(() => {
    if (productError) {
      toast.error(productError);
      dispatch(clearProductErrors());
    }
    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearReviewErrors());
    }
  }, [productError, reviewError, dispatch])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };


  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title={`${product.name} -- ShopNest`} />
      <div className="lg:w-4/5">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full flex flex-col md:flex-row bg-white p-6 gap-6"
        >
          {/* Product Images */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center items-center md:w-1/2"
          >
            <div className="relative w-full max-w-xl rounded-lg overflow-hidden bg-gray-100 aspect-square shadow-lg">
              <ImageCarousel images={product.images} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} ></ImageCarousel>
            </div>
            {product.images && product.images.length > 1 && (
              <motion.div
                className="grid grid-cols-4 gap-2 mt-4"
                variants={itemVariants}
              >
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-primary scale-105' : 'border-transparent hover:border-gray-300'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 lg:w-1/2"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-gray-900 text-3xl md:text-4xl lg:text-5xl font-bold">
                {product.name}
              </h1>
              <p className="text-gray-600 text-sm mt-1">ID # {product._id}</p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price}
              </span>
              <motion.div
                className={`inline-block ml-3 px-2 py-1 text-xs font-medium rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                animate={{
                  scale: [1, 1.05, 1],
                  transition: { duration: 1, repeat: Infinity }
                }}
              >
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </motion.div>
            </motion.div>

            <motion.div
              className="flex items-center border-y py-2"
              variants={itemVariants}
            >
              <StarRating rating={product.ratings} />
              <span className="text-gray-700 text-sm ml-2">
                ({product.numberOfReviews} Reviews)
              </span>
            </motion.div>

            <motion.div
              className="flex gap-4 justify-between lg:justify-between"
              variants={itemVariants}
            >
              <div className="flex items-center border rounded-md overflow-hidden">
                <motion.button
                  onClick={decreaseQuantity}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  disabled={quantity <= 1}
                  whileTap={{ scale: 0.95 }}
                >
                  -
                </motion.button>
                <span className="px-4 py-1 bg-gray-50 text-center w-12">
                  {quantity}
                </span>
                <motion.button
                  onClick={increaseQuantity}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                  whileTap={{ scale: 0.95 }}
                >
                  +
                </motion.button>
              </div>
              <motion.button
                className={`${product.stock < 1
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-primary hover:bg-blue-700"
                  } text-white px-3.5 py-1.5 rounded-lg w-fit`}
                onClick={addToCartHandler}
                disabled={product.stock < 1}
                whileHover={product.stock < 1 ? {} : { scale: 1.05 }}
                whileTap={product.stock < 1 ? {} : { scale: 0.95 }}
              >
                Add to Cart
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="font-semibold text-lg">Description:</h4>
              <p className="text-gray-700 mt-2 leading-relaxed">{product.description}</p>
            </motion.div>


            {/* <motion.button
              className={`${product.stock < 1
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-primary hover:bg-blue-700"
                } text-white px-3.5 py-1.5 rounded-lg w-fit`}
              onClick={addToCartHandler}
              disabled={product.stock < 1}
              whileHover={product.stock < 1 ? {} : { scale: 1.05 }}
              whileTap={product.stock < 1 ? {} : { scale: 0.95 }}
            >
              Buy Now
            </motion.button> */}
          </motion.div>
        </motion.div>

        {/* Reviews Section */}
        <motion.section
          className="w-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col max-w-7xl mx-auto gap-4">
            <motion.div
              className="text-center "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 ">
                Customer Experiences
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
              <p className="text-sm sm:text-base mt-4 text-gray-600 max-w-2xl mx-auto">
                What our customers say about this product
              </p>
            </motion.div>

            {product.reviews && product.reviews.length > 0 && (
              <motion.div
                className="sm:mt-12 bg-white rounded-xl p-6 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-md sm:text-xl font-bold text-gray-900">
                      Overall Rating
                    </h3>
                    <div className="flex items-center justify-center md:justify-start mt-2">
                      <StarRating rating={product.ratings} />
                      <span className="ml-2 text-gray-700">
                        {product.ratings.toFixed(1)} out of 5
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">
                      Based on {product.numberOfReviews} customer reviews
                    </p>
                  </div>

                  <motion.button
                    onClick={toggleReviewModal}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variants={itemVariants}
                  >
                    Share Your Experience
                  </motion.button>
                </div>
              </motion.div>
            )}

            {product.reviews && product.reviews.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
                <AnimatePresence>
                  {product.reviews.map((review) => (
                    <div key={review._id}>
                      <ReviewCard review={review} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Be the first to share your experience with this product!
                </p>
                <motion.button
                  onClick={toggleReviewModal}
                  className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Write a Review
                </motion.button>
              </motion.div>
            )}


          </div>
        </motion.section>

        {/* Review Modal */}
        <AnimatePresence>
          {openReviewModal && (
            <motion.div
              className="fixed inset-0 z-50 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <motion.div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.65 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="absolute inset-0 bg-black" onClick={toggleReviewModal}></div>
                </motion.div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <motion.div
                  className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Submit Your Review
                    </h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg
                              className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Review
                      </label>
                      <textarea
                        id="comment"
                        rows="4"
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 rounded-md p-2 transition-all focus:ring-2 focus:ring-opacity-50"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <motion.button
                      type="button"
                      onClick={reviewSubmitHandler}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-blue-700 focus:ring-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Submit Review
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={toggleReviewModal}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProductDetails;