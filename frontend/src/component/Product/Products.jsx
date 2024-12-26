import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.jsx";
import ProductCard from "../Home/ProductCard.jsx";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { toast } from 'react-toastify';
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, getProduct } from "../../slices/productSlice.js";
import { useParams } from "react-router";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);
  const {
    products,
    loading,
    error,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.productsData);


  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct({ keyword, currentPage, price, category, ratings }));
  }, [dispatch, keyword, currentPage, price, category, ratings, toast, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="PRODUCTS -- ECOMMERCE" />
          <h2 className="text-center text-2xl font-semibold mt-8 border-b-2 pb-2 mx-auto w-48 text-gray-700">
            Products
          </h2>
          <div className="flex">
            <div className="w-1/3 top-32 left-10 bg-white p-6 shadow-lg rounded-lg">
              <Typography className="text-lg font-medium mb-4">Price</Typography>
              <Slider
                value={price}
                onChange={priceHandler}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={25000}
              />

              <Typography className="text-lg font-medium mt-6 mb-4">
                Categories
              </Typography>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={category}
                    className="cursor-pointer text-gray-600 hover:text-red-500"
                    onClick={() => setCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>

              <fieldset className="mt-6 border p-4">
                <Typography className="text-lg font-medium mb-4">
                  Ratings Above
                </Typography>
                <Slider
                  value={ratings}
                  onChange={(e, newRating) => setRatings(newRating)}
                  aria-labelledby="continuous-slider"
                  valueLabelDisplay="auto"
                  min={0}
                  max={5}
                />
              </fieldset>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {products &&
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>

          </div>
          {resultPerPage < filteredProductsCount && (
            <div className="flex justify-center mt-12">
              <button
                className={`bg-white border rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer ${currentPage <= 1 ? 'hidden' : ''}`}
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
              >
                Previous
              </button>
              <Typography className="bg-white border rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">{currentPage}</Typography>
              <button
                className={`bg-white border rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer ${resultPerPage * currentPage > filteredProductsCount ? 'hidden' : ''}`}
                onClick={() => {
                  if (resultPerPage * currentPage < filteredProductsCount) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
              >  Next </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Products;
