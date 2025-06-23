import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../../slices/cartSlice";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import {
  FaHome,
  FaCity,
  FaMapMarkerAlt,
  FaGlobeAmericas,
  FaPhoneAlt,
  FaArrowRight
} from "react-icons/fa";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.userData);
  const { shippingInfo, cartItems } = useSelector((state) => state.cartData);
  const [formData, setFormData] = useState({
    address: shippingInfo.address || "",
    city: shippingInfo.city || "",
    state: shippingInfo.state || "",
    country: shippingInfo.country || "",
    pinCode: shippingInfo.pinCode || "",
    phoneNo: shippingInfo.phoneNo || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const shippingSubmit = (e) => {
    e.preventDefault();
    if (formData.phoneNo.length !== 10) {
      toast.error("Phone Number should be 10 digits long");
      return;
    }
    dispatch(saveShippingInfo(formData));
    navigate("/order/confirm");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/order/shipping");
    }
    if (!cartItems.length) {
      navigate("/cart");
    }
  }, [isAuthenticated, cartItems, navigate]);

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.5)" },
  };

  return (
    isAuthenticated &&
    <>
      <MetaData title="Shipping -- ShopNest" />
      <motion.div layoutId="checkout-container"
        className="w-full max-w-md mx-auto mb-4 bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Shipping Details
          </h2>

          <form onSubmit={shippingSubmit} className="space-y-5">
            {[
              {
                icon: <FaHome className="text-gray-500" />,
                name: "address",
                placeholder: "Address",
                type: "text",
                value: formData.address,
              },
              {
                icon: <FaCity className="text-gray-500" />,
                name: "city",
                placeholder: "City",
                type: "text",
                value: formData.city,
              },
              {
                icon: <FaMapMarkerAlt className="text-gray-500" />,
                name: "pinCode",
                placeholder: "Pin Code",
                type: "number",
                value: formData.pinCode,
              },
              {
                icon: <FaPhoneAlt className="text-gray-500" />,
                name: "phoneNo",
                placeholder: "Phone Number",
                type: "number",
                value: formData.phoneNo,
              },
            ].map((field, index) => (
              <motion.div
                key={field.name}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                {field.icon}
                <motion.input
                  whileFocus="focus"
                  variants={inputVariants}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  required
                  value={field.value}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                />
              </motion.div>
            ))}

            <motion.div
              variants={formVariants}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-3"
            >
              <FaGlobeAmericas className="text-gray-500" />
              <select
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none bg-white"
              >
                <option value="">Country</option>
                {Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {formData.country && (
              <motion.div
                variants={formVariants}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-3"
              >
                <FaMapMarkerAlt className="text-gray-500" />
                <select
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none bg-white"
                >
                  <option value="">State</option>
                  {State.getStatesOfCountry(formData.country).map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!formData.state}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${formData.state
                ? "bg-primary text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              <span>Continue</span>
              <FaArrowRight />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default Shipping;