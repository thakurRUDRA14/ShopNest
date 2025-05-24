import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

function Search() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

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
      <form className="relative w-full max-w-xl" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-md"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type='submit' className="absolute right-3 top-2.5 text-gray-500 hover:text-indigo-600 transition-colors">
          <FiSearch size={20} />
        </button>
      </form>
    </>
  );
};

export default Search;
