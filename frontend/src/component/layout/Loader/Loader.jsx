import { motion } from 'motion/react';
import favicon from '../../../assets/favicon.png';

const Loader = ({ message = "Loading your shopping experience..." }) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* ShopNest Logo with Shopping Bag Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >

          <motion.img
            animate={{
              y: [-2, 2, -2],
              rotate: [-5, 1, -5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-xl flex items-center justify-center mb-3 shadow-lg"
            src={favicon}
            alt="ShopNest" />

          {/* Brand Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopNest
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium">Your Shopping Paradise</p>
          </motion.div>
        </motion.div>

        {/* Loading Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-sm md:text-base font-medium text-center max-w-xs"
        >
          {message}
        </motion.p>

        {/* Progress Bar with Shopping Theme */}
        <div className="w-52 md:w-72 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-full w-1/2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-sm"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Loader