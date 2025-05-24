import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import profilePng from "../../assets/Profile.png";
import StarRating from "./StarRating";

const ReviewCard = ({ index, review }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const wordCount = review.comment.split(/\s+/).length;
  let modalWidthClass = "max-w-md";

  if (wordCount > 50) {
    modalWidthClass = "max-w-lg";
  }
  if (wordCount > 100) {
    modalWidthClass = "max-w-xl";
  }
  if (wordCount > 150) {
    modalWidthClass = "max-w-2xl";
  }
  if (wordCount > 200) {
    modalWidthClass = "max-w-3xl";
  }
  if (wordCount > 300) {
    modalWidthClass = "max-w-4xl";
  }

  return (
    <>
      <motion.div
        layoutId={`card-${index}`}
        animate={{ y: 0 }}
        whileHover={{ y: -5 }}
        className="flex flex-col items-center p-6 shadow-md border border-gray-100 w-full rounded-lg bg-white hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <motion.img
          layoutId={`avatar-${index}`}
          src={review.avatar?.url || profilePng}
          alt="User"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full mb-4 object-cover border-2 border-primary"
          whileHover={{ scale: 1.1 }}

        />
        <motion.p
          layoutId={`name-${index}`}
          className="font-medium text-gray-800"
        >
          {review.name}
        </motion.p>
        <motion.div
          layoutId={`rating-${index}`}
          className="my-2"
        >
          <StarRating rating={review.rating} />
        </motion.div>
        <motion.span
          layoutId={`comment-preview-${index}`}
          className="text-gray-600 text-sm text-center italic line-clamp-2"
        >
          "{review.comment}"
        </motion.span>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              layoutId={`card-${index}`}
              className={`bg-white rounded-lg ${modalWidthClass} w-full p-6 relative max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col items-center">
                <motion.img
                  layoutId={`avatar-${index}`}
                  src={review.avatar?.url || profilePng}
                  alt="User"
                  className="w-20 h-20 rounded-full mb-4 object-cover border-2 border-primary"
                />
                <motion.p
                  layoutId={`name-${index}`}
                  className="font-medium text-gray-800 text-lg"
                >
                  {review.name}
                </motion.p>
                <motion.div
                  layoutId={`rating-${index}`}
                  className="my-3"
                >
                  <StarRating rating={review.rating} />
                </motion.div>
                <motion.div
                  layoutId={`comment-preview-${index}`}
                  className="flex justify-center mt-4"
                >
                  <div>
                    <p className="text-gray-700 text-justify">
                      "{review.comment}"
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReviewCard;