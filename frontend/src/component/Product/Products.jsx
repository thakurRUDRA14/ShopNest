import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import Loader from "../layout/Loader/Loader.jsx";
import ProductCard from "./ProductCard.jsx";
import MetaData from "../layout/MetaData.jsx";
import Filters from "./Filters.jsx";
import Pagination from "./Pagination.jsx";

const Products = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("search") ? searchParams.get("search") : "";
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const {
    products,
    loading,
    resultsPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.productsData);

  const totalPages = Math.ceil(filteredProductsCount / resultsPerPage);
  if (loading && !products) return <Loader />;

  return (
    <>
      <MetaData title="Products -- ShopNest" />
      <div className="container mx-auto p-4 sm:py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {keyword ? `Search Results for "${keyword}"` : "All Products"}
          <span className="block text-sm font-normal text-gray-500 mt-2">
            Showing {products?.length || 0} of {filteredProductsCount} products
          </span>
        </h2>

        <div className="flex flex-col lg:flex-row gap-2 md:gap-8">
          {/* Filters Sidebar - Mobile */}
          <div className="flex justify-end lg:hidden sticky top-32 z-10">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors z-10 relative"
              aria-label={showFilters ? 'Hide filters' : 'Show filters'}
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                animate={{
                  scale: showFilters ? [1, 1.1, 1] : 1,
                  rotate: showFilters ? [0, 10, -10, 0] : 0
                }}
                transition={{ duration: 0.5 }}
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </motion.svg>
            </motion.button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                    y: -20,
                    originY: 0,
                    originX: 1
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 10
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    y: -20
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  className="absolute right-6 mt-7 w-64 bg-white rounded-lg shadow-2xl z-20 p-4"
                >
                  <Filters currentPage={currentPage} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pb-6">
              <Filters currentPage={currentPage} />
            </div>
          </div>
          {/* Products Grid */}
          <div className="flex-1">
            {products && products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                  </div>
                )}
              </>
            ) : (
              <div className="h-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-50">
                <h3 className="text-xl font-medium text-gray-600">No products found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;