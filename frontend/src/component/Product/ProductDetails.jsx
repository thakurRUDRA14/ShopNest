import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import Carousel from "react-material-ui-carousel";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import MetaData from "../layout/MetaData";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Rating,
} from "@mui/material";
import ReviewCard from "./ReviewCard.jsx";
import Loader from "../layout/Loader/Loader.jsx";
import { clearErrors as clearProductErrors, getProductDetails } from "../../slices/productSlice.js";
import { addToCart } from "../../slices/cartSlice.js";
import { newReview, clearErrors as clearReviewErrors, resetOperationStatus } from "../../slices/reviewSlice.js";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { productId } = useParams()
  const { productDetails, loading, error: productError } = useSelector(
    (state) => state.productsData
  );
  const { operationSuccess, error: reviewError, message } = useSelector((state) => state.reviewData)

  const product = productDetails;

  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

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

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const reviewForm = new FormData();
    reviewForm.set("rating", rating);
    reviewForm.set("comment", comment);
    reviewForm.set("productId", productId);
    dispatch(newReview(reviewForm));

    setOpen(false);
  };

  useEffect(() => {
    if (productError) {
      toast.error(productError);
      dispatch(clearProductErrors());
    }
    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearReviewErrors());
    }

    if (operationSuccess) {
      toast.success(message);
      dispatch(resetOperationStatus());
    }

    dispatch(getProductDetails(productId));
  }, [dispatch, productId, productError, reviewError, operationSuccess]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className="flex flex-col lg:flex-row bg-white p-6 gap-6">
            <div className="flex justify-center items-center w-1/2">
              <Carousel className="w-[20vmax]">
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                      className="p-4"
                    />
                  ))}
              </Carousel>
            </div>

            <div className="flex flex-col gap-4 w-1/2">
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm">product # {product._id}</p>
              </div>
              <div className="flex items-center border-y py-2">
                <Rating {...options} />
                <span className="text-gray-700 text-sm ml-2">
                  ({product.numberOfReviews} Reviews)
                </span>
              </div>
              <div>
                <h1 className="text-xl text-gray-800 font-bold">
                  ₹{product.price}
                </h1>
                <div className="flex gap-4 items-center">
                  <div className="flex items-center">
                    <button
                      className="bg-gray-600 text-white w-7 py-1 mr-2 rounded-md"
                      onClick={decreaseQuantity}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      readOnly
                      className="text-center w-10 border-none border-gray-400 rounded"
                    />
                    <button
                      className="bg-gray-600 text-white w-7 py-1 rounded-md"
                      onClick={increaseQuantity}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={`${product.stock < 1
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-700"
                      } text-white px-3.5 py-1.5 rounded-lg w-1/5`}
                    onClick={addToCartHandler}
                    disabled={product.stock < 1}
                  >
                    Add to Cart
                  </button>
                </div>
                <p className="text-gray-600 mt-2">
                  Status:
                  <b
                    className={`${product.stock < 1 ? "text-red-600" : "text-green-600"
                      }`}
                  >
                    {product.stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Description:</h4>
                <p className="text-gray-700">{product.description}</p>
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-1/3"
                onClick={submitReviewToggle}
              >
                Submit Review
              </button>
            </div>
          </div>

          <h3 className="text-center text-gray-800 text-lg font-semibold border-b mx-auto mt-8 mb-4 w-40">
            REVIEWS
          </h3>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="flex flex-col">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="border border-gray-300 mt-4 p-2 rounded"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={submitReviewToggle}
                color="secondary">
                Cancel
              </Button>
              <Button
                onClick={reviewSubmitHandler}
                color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className="flex gap-4 overflow-x-auto">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No Reviews Yet</p>
          )}
        </>
      )}

    </>
  );
};

export default ProductDetails;
