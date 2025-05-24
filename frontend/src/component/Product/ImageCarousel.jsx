import { motion, AnimatePresence } from "motion/react";
const ImageCarousel = ({ images, currentImageIndex, setCurrentImageIndex }) => {

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };


    const imageVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0 }
    };
    return (
        <div className="max-w-xl relative rounded-lg overflow-hidden bg-gray-100 aspect-square shadow-lg">
            {images && images.length > 0 && (
                <>
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={images[currentImageIndex].url}
                            alt={name}
                            className="w-full h-full object-contain"
                            variants={imageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        />
                    </AnimatePresence>
                    {images.length > 1 && (
                        <>
                            <motion.button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </motion.button>
                            <motion.button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </motion.button>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default ImageCarousel