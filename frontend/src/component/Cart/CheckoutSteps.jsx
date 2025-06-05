import { motion } from "motion/react";
import { FaTruck, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const CheckoutSteps = () => {
  const location = useLocation();

  let activeStep;
  if (location.pathname.includes("order/shipping")) {
    activeStep = 0;
  } else if (location.pathname.includes("order/confirm")) {
    activeStep = 1;
  } else if (location.pathname.includes("order/payment")) {
    activeStep = 2;
  } else {
    activeStep = 0;
  }

  const steps = [
    {
      label: "Shipping Details",
      icon: <FaTruck className="text-xl md:text-2xl" />,
    },
    {
      label: "Confirm Order",
      icon: <FaCheckCircle className="text-xl md:text-2xl" />,
    },
    {
      label: "Payment",
      icon: <FaMoneyBillWave className="text-xl md:text-2xl" />,
    },
  ];

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-center relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0 mx-auto w-4/5"></div>
        <motion.div
          layoutId="progress-line"
          className="absolute top-5 left-0 h-1 bg-primary z-0 transition-all duration-500 ease-in-out"
          style={{
            width: `${((activeStep / (steps.length - 1)) * 100) || 25}%`,
            maxWidth: '80%',
            left: '10%'
          }}
        ></motion.div>

        <div className="flex justify-between w-full max-w-3xl relative z-10">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={stepVariants}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <Link
                to={item.label === "Shipping Details" ? "/order/shipping" : item.label === "Confirm Order" ? "/order/confirm" : item.label === "Payment" ? "/order/payment" : "/"}
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= index
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-200 text-gray-500"
                  } transition-all duration-300`}
              >
                {item.icon}
              </Link>
              <span
                className={`text-xs md:text-sm font-medium text-center ${activeStep >= index ? "text-primary" : "text-gray-500"
                  }`}
              >
                {item.label}
              </span>
              {activeStep === index && (
                <motion.div
                  className="w-2 h-2 bg-primary rounded-full mt-1"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;