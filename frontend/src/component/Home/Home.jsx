import { useEffect, useState } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { HiOutlineShoppingBag, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineCreditCard } from "react-icons/hi";
import ProductCard from "./ProductCard.jsx";
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
  heading: "Summer Collection 2025",
  description: "Discover our new arrivals with up to 50% off selected items ",
  link: "/products",
}

const offers = [
  {
    image: "https://res.cloudinary.com/rudra-backend/image/upload/v1734907188/ShopNest/assets/Cover.jpg",
    heading: "Summer Collection 2025",
    description: "Discover our new arrivals with up to 50% off selected items",
    link: "/products",
    code: "SUMMER50"
  },
  {
    image: "https://example.com/winter-sale.jpg",
    heading: "Summer Sale",
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
    name: "Mohit Chauhan",
    role: "Frequent Shopper",
    content: "This store has the best selection and prices. Delivery is always fast and products are high quality.",
    rating: 5,
  },
  {
    name: "Riya Chawla",
    role: "First-time Buyer",
    content: "Impressed with the customer service. They helped me choose the perfect gift for my wife's birthday.",
    rating: 4,
  },
  {
    name: "Rudra Pratap Singh",
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
  const [resultsPerPage, setResultsPerPage] = useState(() =>
    window.innerWidth > 1530 ? 10 : 8
  );

  const featuredProducts = products?.slice(0, resultsPerPage) || [];
  const trendingProducts = products?.slice(0, 10) || [];
  const newArrivals = products?.slice(0, 10) || [];


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1536 || window.innerWidth < 640) {
        setResultsPerPage(10);
      } else if (window.innerWidth < 1530 && window.innerWidth >= 1024) {
        setResultsPerPage(8);
      } else {
        setResultsPerPage(10);
      }
    };

    window.addEventListener('resize', handleResize);

    // Set initial value just in case
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [window.innerWidth, dispatch]);

  useEffect(() => {
    dispatch(getProduct());
  }, [])

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

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

        {/* Featured Products */}
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 lg:mb-10">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                  Featured Products
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Discover our handpicked selection of premium products
                </p>
              </div>
              <Link
                to="/products"
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                View All <FiChevronRight className="ml-1" />
              </Link>
            </div>

            {/* Desktop/Tablet Grid */}
            <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 xl:gap-7">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="block md:hidden">
              <ProductCarousel products={featuredProducts} />
            </div>

            {/* Empty State */}
            {(!featuredProducts || featuredProducts.length === 0) && (
              <div className="text-center py-12 sm:py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Featured Products
                  </h3>
                  <p className="text-gray-500 mb-6">
                    We're currently updating our featured products. Please check back soon!
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Browse All Products
                  </Link>
                </div>
              </div>
            )}
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
      </div>
    </>
  );
}

export default Home;