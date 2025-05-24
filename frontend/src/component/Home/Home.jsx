import { useEffect, useState } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { HiOutlineShoppingBag, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineCreditCard } from "react-icons/hi";
import ProductCard from "../Product/ProductCard.jsx";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../slices/productSlice.js";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.jsx";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ProductCarousel from "./ProductCarousel.jsx";
import StarRating from "../Product/StarRating.jsx";

const sale = {
  image: "https://res.cloudinary.com/rudra-backend/image/upload/v1734907188/ShopNest/assets/Cover.jpg",
  heading: "Summer Collection 2023",
  description: "Discover our new arrivals with up to 50% off selected items ",
  link: "/products",
}

const categories = [
  { name: "Electronics", icon: "📱" },
  { name: "Fashion", icon: "👕" },
  { name: "Household", icon: "🏠" },
  { name: "Beauty", icon: "💄" },
  { name: "Sports", icon: "⚽" },
  { name: "Toys", icon: "🧸" },
  { name: "Books", icon: "📚" },
  { name: "Groceries", icon: "🛒" },
];

const offers = [
  {
    image: "https://res.cloudinary.com/rudra-backend/image/upload/v1734907188/ShopNest/assets/Cover.jpg",
    heading: "Summer Collection 2023",
    description: "Discover our new arrivals with up to 50% off selected items",
    link: "/products",
    code: "SUMMER50"
  },
  {
    image: "https://example.com/winter-sale.jpg",
    heading: "Winter Sale",
    description: "Get 30% off on all electronics this weekend",
    link: "/electronics",
    code: "WEEKEND30"
  }
];

const features = [
  {
    icon: <HiOutlineShoppingBag className="w-6 h-6" />,
    title: "Free Shipping",
    description: "On orders over ₹500",
  },
  {
    icon: <HiOutlineTruck className="w-6 h-6" />,
    title: "Fast Delivery",
    description: "4-5 business days",
  },
  {
    icon: <HiOutlineShieldCheck className="w-6 h-6" />,
    title: "Secure Checkout",
    description: "100% protected",
  },
  {
    icon: <HiOutlineCreditCard className="w-6 h-6" />,
    title: "Easy Returns",
    description: "7-day policy",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Frequent Shopper",
    content: "This store has the best selection and prices. Delivery is always fast and products are high quality.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "First-time Buyer",
    content: "Impressed with the customer service. They helped me choose the perfect gift for my wife's birthday.",
    rating: 4,
  },
  {
    name: "Emily Rodriguez",
    role: "Loyal Customer",
    content: "I've been shopping here for years. The quality never disappoints and their return policy is fair.",
    rating: 5,
  },
];

function Home() {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.productsData);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentOffer = offers[currentOfferIndex];


  const featuredProducts = products?.slice(0, 8) || [];
  const trendingProducts = products?.slice(0, 8) || [];
  const newArrivals = products?.slice(0, 8) || [];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, toast, error]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [offers.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title="ShopNest - Modern Online Shopping" />
      <div className="w-full">
        {/* Hero Section */}
        {sale && <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white overflow-hidden">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {sale.heading}
                </h1>
                <p className="text-lg md:text-xl mb-6">
                  {sale.description}
                </p>
                <div className="flex space-x-4">
                  <Link
                    to="/products"
                    className="bg-white text-indigo-600 px-4 py-3 rounded-lg font-medium hover:bg-gray-100 transition duration-300"
                  >
                    Shop Now
                  </Link>
                  <Link
                    to={sale.link}
                    className="border-2 border-white text-white px-4 py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition duration-300"
                  >
                    View Sale
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img
                  src={sale.image || "https://res.cloudinary.com/rudra-backend/image/upload/v1734907188/ShopNest/assets/Cover.jpg"}
                  alt={sale.heading}
                  className="hidden md:block max-w-md rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform lg:-skew-y-2 origin-top-left"></div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white origin-top-left"></div>
        </section>}

        {/* Categories Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-12">Shop by Category</h2>

            {/* Desktop View */}
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/products?category=${category.name.toLowerCase()}`}
                  className="bg-white py-3 md:p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 flex md:flex-col items-center justify-evenly gap-2 md:gap-0 whitespace-nowrap"
                >
                  <span className="text-xl md:text-2xl md:mb-2">{category.icon}</span>
                  <span className="text-xs md:text-base md:font-medium text-gray-800 line-clamp-1">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
              <Link
                to="/products"
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                View All <FiChevronRight className="ml-1" />
              </Link>
            </div>
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-x-10 lg:gap-5 xl:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="lg:hidden">
              <ProductCarousel products={featuredProducts}></ProductCarousel>
            </div>
          </div>
        </section>

        {/* Offer Section */}
        <section className="py-12 text-white relative overflow-hidden">
          {currentOffer.image && (
            <div className="absolute inset-0 z-0">
              <img
                src={currentOffer.image}
                alt=""
                className="w-full h-full object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-indigo-600/90"></div>
            </div>
          )}

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {currentOffer.heading}
            </h2>

            <p className="text-xl mb-6 max-w-2xl mx-auto">
              {currentOffer.description} {currentOffer.code && (
                <>Use code <span className="font-bold">{currentOffer.code}</span> at checkout.</>
              )}
            </p>

            <Link
              to={currentOffer.link}
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition duration-300"
            >
              Shop Now
            </Link>

            {/* Navigation dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentOfferIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentOfferIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                  aria-label={`Go to offer ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => setCurrentOfferIndex((prev) => (prev - 1 + offers.length) % offers.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 p-2 rounded-full z-10 hover:bg-white/50 transition"
            aria-label="Previous offer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentOfferIndex((prev) => (prev + 1) % offers.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 p-2 rounded-full z-10 hover:bg-white/50 transition"
            aria-label="Next offer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>

        {/* Trending Products */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
              <Link
                to="/products"
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                View All <FiChevronRight className="ml-1" />
              </Link>
            </div>
            <ProductCarousel products={trendingProducts}></ProductCarousel>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 text-center"
                >
                  <div className="text-indigo-600 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
              <Link
                to="/products"
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                View All <FiChevronRight className="ml-1" />
              </Link>
            </div>
            <ProductCarousel products={newArrivals}></ProductCarousel>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className="w-full flex-shrink-0 px-4"
                    >
                      <div className="bg-white p-8 rounded-lg shadow-sm">
                        <div className="flex mb-4">
                          <StarRating rating={testimonial.rating} />
                        </div>
                        <p className="text-gray-600 mb-6 italic line-clamp-1">"{testimonial.content}"</p>
                        <div>
                          <p className="font-bold">{testimonial.name}</p>
                          <p className="text-gray-500 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              >
                <FiChevronRight size={24} />
              </button>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-indigo-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-8 md:py-12 bg-indigo-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 max-w-2xl mx-auto">
              Get the latest updates on new products and upcoming sales
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 sm:py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none text-gray-800"
              />
              <button className="bg-indigo-800 hover:bg-indigo-900 px-6 py-2 sm:py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none font-medium transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;