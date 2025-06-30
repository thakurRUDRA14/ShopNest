import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../slices/productSlice.js";
import { toast } from 'react-toastify';
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import PriceRangeSlider from "./PriceRangeSlider.jsx";

const categories = [
    {
        name: "Electronics",
        subcategories: [
            "SmartPhones",
            "Laptops",
            "Cameras",
            "Headphones",
            "Tablets"
        ]
    },
    {
        name: "Health & Fitness",
        subcategories: [
            "Fitness Trackers",
            "Massagers",
            "Supplements"
        ]
    },
    {
        name: "Home & Kitchen",
        subcategories: [
            "Appliances",
            "Cookware",
            "Furniture"
        ]
    },
    {
        name: "Accessories",
        subcategories: [
            "Watches",
            "Bags",
            "Jewelry"
        ]
    },
    {
        name: "Grocery",
        subcategories: [
            "Snacks",
            "Beverages",
            "Pantry"
        ]
    }
];

const Filters = ({ currentPage }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const keyword = searchParams.get("search") ? searchParams.get("search") : "";

    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [ratings, setRatings] = useState(0);
    const [expandedCategories, setExpandedCategories] = useState({});

    const { error } = useSelector((state) => state.productsData);

    const resetFilters = () => {
        setCategory("");
        setSubCategory("");
        setPrice([0, 25000]);
        setRatings(0);
        setExpandedCategories({});
    };

    const handleCategoryClick = (catName) => {
        if (category === catName) {
            resetFilters();
        } else {
            setCategory(catName);
            setSubCategory("");
            setExpandedCategories({ [catName]: true });
        }
    };
    const handleSubCategoryClick = (subCatName) => {
        subCategory === subCatName ? setSubCategory("") : setSubCategory(subCatName)
    };

    useEffect(() => {
        dispatch(getProduct({ keyword, currentPage, price, category, subCategory, ratings }));
    }, [dispatch, keyword, currentPage, price, category, subCategory, ratings]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [error, dispatch])

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-white p-4 rounded-lg shadow-sm"
        >
            <div className="mb-4 md:mb-6">
                <h3 className="text-lg font-semibold mb-2 md:mb-4 text-gray-700">Price Range</h3>
                <PriceRangeSlider
                    min={0}
                    max={100000}
                    value={price}
                    onChange={setPrice}
                />
            </div>

            <div className="mb-4 md:mb-6">
                <h3 className="text-lg font-semibold mb-2 md:mb-4 text-gray-700">Categories</h3>
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => { setCategory(""); setSubCategory(""); setExpandedCategories({}) }}
                            className={`w-full text-left px-3 py-2 rounded-lg ${category === "" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                            All Categories
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat.name} className="space-y-1">
                            <button
                                onClick={handleCategoryClick.bind(null, cat.name)}
                                className={`w-full flex justify-between items-center px-3 py-1 md:py-2 rounded-lg ${category === cat.name ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                            >
                                <span>{cat.name}</span>
                                <svg
                                    className={`h-4 w-4 transform transition-transform ${expandedCategories[cat.name] ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {expandedCategories[cat.name] && (
                                    <motion.ul
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="pl-4 space-y-1 overflow-hidden"
                                    >
                                        {cat.subcategories.map((subcat) => (
                                            <li key={subcat}>
                                                <button
                                                    onClick={handleSubCategoryClick.bind(null, subcat)}
                                                    className={`w-full text-left px-3 py-1 md:py-2 rounded-lg ${subCategory === subcat ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                                                >
                                                    {subcat}
                                                </button>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="space-y-3 md:space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2 md:mb-4 text-gray-700">Minimum Rating</h3>
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRatings(star)}
                                className={`text-2xl ${ratings >= star ? "text-yellow-400" : "text-gray-300"}`}
                            >
                                ★
                            </button>
                        ))}
                        {ratings > 0 && (
                            <button
                                onClick={() => setRatings(0)}
                                className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    Reset All Filters
                </button>
            </div>
        </motion.div>
    );
};

export default Filters; 