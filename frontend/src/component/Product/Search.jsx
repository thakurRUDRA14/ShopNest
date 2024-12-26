import React, { useState } from "react";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";

function Search() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate(); // Fix: Updated Navigate to useNavigate hook

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <>
      <MetaData title="Search A Product -- ECOMMERCE" />
      <form
        className=" px-60 fixed inset-0 flex items-center justify-center gap-5 bg-gray-300"
        onSubmit={searchSubmitHandler}
      >
        <input
          type="text"
          placeholder="Search a Product ..."
          className="shadow-md bg-slate-100 border-none text-gray-700 px-6 py-4 w-1/2 outline-none rounded-md font-light text-lg font-cursive box-border h-12 duration-100 hover:bg-white sm:w-full sm:text-sm sm:h-14"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          type="submit"
          value="Search"
          className="h-12 w-1/12 sm:w-1/3 sm:h-14 bg-red-500 text-white font-light text-lg rounded-md cursor-pointer transition-all duration-500 hover:bg-blue-600"
        />
      </form>
    </>
  );
};

export default Search;
