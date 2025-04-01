import React, { useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard.jsx";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../slices/productSlice.js";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.jsx";
import { toast } from "react-toastify"
import Cover from '../../assets/Cover.jfif';

function Home() {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.productsData);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, toast, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="ShopNest" />
          <div className="banner bg-cover bg-center bg-no-repeat h-[100vmin] flex flex-col items-center justify-center text-center text-white" style={{ backgroundImage: `url(${"https://res.cloudinary.com/rudra-backend/image/upload/v1734907188/ShopNest/assets/Cover.jpg" || Cover})` }}>
            <p className="font-['Lucida_Sans'] font-light text-">Welcome to Ecommerce</p>
            <h1 className="my-[5vmax] font-['Roboto'] font-semibold text-[2.5vmax]">FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button className="mb-5 cursor-pointer bg-white opacity-90 border border-white rounded-md p-2 transition-all duration-500 w-24 font-['Roboto'] font-medium text-sm hover:bg-transparent text-black hover:text-white flex align-middle justify-evenly ">
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading text-center font-['Roboto'] text-[1.4vmax] border-b border-[rgba(21,21,21,0.5)] w-[20vmax] p-[1vmax] my-[5vmax] mx-auto text-[rgba(0,0,0,0.7)]">Featured Products</h2>
          <div className="container flex flex-wrap justify-center m-[2vmax_auto] w-[80vw] max-w-full" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
