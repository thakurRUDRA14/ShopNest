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
      shortLabel: "Shipping",
      icon: <FaTruck className="text-lg sm:text-xl md:text-2xl" />,
      path: "/order/shipping",
      description: "Enter your delivery address"
    },
    {
      label: "Confirm Order",
      shortLabel: "Confirm",
      icon: <FaCheckCircle className="text-lg sm:text-xl md:text-2xl" />,
      path: "/order/confirm",
      description: "Review your order details"
    },
    {
      label: "Payment",
      shortLabel: "Payment",
      icon: <FaMoneyBillWave className="text-lg sm:text-xl md:text-2xl" />,
      path: "/order/payment",
      description: "Complete your purchase"
    },
  ];

  const stepVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  };

  const progressVariants = {
    initial: { scaleX: 0, originX: 0 },
    animate: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const isStepClickable = (stepIndex) => {
    return stepIndex <= activeStep;
  };

  const getStepPath = (stepIndex) => {
    return isStepClickable(stepIndex) ? steps[stepIndex].path : "#";
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-2 sm:py-6 lg:py-6">
      <div className="flex justify-center relative">
        {/* Background Progress line */}
        <div className="absolute top-6 sm:top-7 lg:top-8 left-0 right-0 mx-auto w-[calc(100%-4rem)] sm:w-[calc(100%-6rem)] lg:w-4/5 max-w-4xl">
          <div className="h-1 sm:h-1.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shadow-inner"></div>
        </div>

        {/* Active Progress line */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={progressVariants}
          className="absolute top-6 sm:top-7 lg:top-8 left-0 right-0 mx-auto w-[calc(100%-4rem)] sm:w-[calc(100%-6rem)] lg:w-4/5 max-w-4xl"
        >
          <div
            className="h-1 sm:h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-violet-500 rounded-full shadow-lg transition-all duration-700 ease-out"
            style={{
              width: `${((activeStep / (steps.length - 1)) * 100) || 0}%`,
            }}
          >
            <div className="h-full bg-white/30 rounded-full animate-pulse"></div>
          </div>
        </motion.div>

        {/* Steps Container */}
        <div className="flex justify-between items-start w-full max-w-4xl relative z-10 px-4 sm:px-8">
          {steps.map((item, index) => {
            const isClickable = isStepClickable(index);
            const isCompleted = index < activeStep;
            const isCurrent = index === activeStep;
            const isFuture = index > activeStep;

            return (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={stepVariants}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col items-center relative group"
              >
                {/* Step Circle */}
                {isClickable ? (
                  <Link
                    to={getStepPath(index)}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 transform hover:scale-110 ${isCurrent
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/25 ring-4 ring-blue-200"
                      : isCompleted
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                        : "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 shadow-md"
                      }`}
                  >
                    {/* Glow effect for current step */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-violet-700"
                        animate={{
                          scale: [1, 1.15, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    <div className="relative z-10">
                      {item.icon}
                    </div>


                  </Link>
                ) : (
                  <div
                    className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 cursor-not-allowed bg-gradient-to-br from-gray-200 to-gray-300 text-gray-400 shadow-inner"
                    title="Complete previous steps first"
                  >
                    <div className="absolute inset-0 rounded-full bg-gray-200/50 backdrop-blur-sm"></div>
                    <div className="relative z-10 opacity-50">
                      {item.icon}
                    </div>
                  </div>
                )}

                {/* Step Label */}
                <div className="text-center max-w-24 sm:max-w-32 lg:max-w-40">
                  <span
                    className={`block text-xs sm:text-sm lg:text-base font-semibold transition-colors duration-300 ${isCurrent
                      ? "text-blue-600"
                      : isCompleted
                        ? "text-green-600"
                        : isFuture
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                  >
                    {/* Show short label on mobile, full label on larger screens */}
                    <span className="sm:hidden">{item.shortLabel}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>

                  {/* Description - hidden on mobile */}
                  <span className={`hidden sm:block text-xs lg:text-sm mt-1 transition-colors duration-300 ${isCurrent
                    ? "text-blue-500"
                    : isCompleted
                      ? "text-green-500"
                      : "text-gray-400"
                    }`}>
                    {item.description}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;