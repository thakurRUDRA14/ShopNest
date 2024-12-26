import React from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  return (
    <Link className="shadow-md w-[14vmax] flex flex-col no-underline text-[#303030] m-[2vmax] transition-all duration-500 pb-[0.5vmax] rounded-lg hover:shadow-[0_0_5px_rgba(15,15,15,0.26)] hover:translate-y-[-1vmax]" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} className="w-[14vmax] rounded-lg" />
      <p className="font-['Roboto'] text-[1.2vmax] m-[1vmax_0.5vmax_0]">{product.name}</p>
      <div className="m-[0.5vmax] flex items-center justify-start">
        <Rating {...options} />{" "}
        <span className="productCardSpan">
          {" "}
          ({product.numberOfReviews} Reviews)
        </span>
      </div>
      <span className="m-[0.5vmax] text-red-500 font-['Franklin_Gothic_Medium','Arial_Narrow',Arial,sans-serif] text-[1vmax]">{`₹${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;
