import { motion, useMotionValue, animate } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ products }) => {
    const carouselRef = useRef();
    const cardsWrapperRef = useRef();
    const cardRef = useRef();
    const [position, setPosition] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [itemWidth, setItemWidth] = useState(300);
    const [gap, setGap] = useState(20);
    const [visibleItems, setVisibleItems] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 5;
        }
        return 2;
    });
    // Motion values for smooth dragging
    const x = useMotionValue(0);

    useEffect(() => {
        function updateMeasurements() {
            if (cardRef.current && carouselRef.current && cardsWrapperRef.current) {
                const cardWidth = cardRef.current.offsetWidth;

                // Get computed gap from CSS
                const styles = window.getComputedStyle(cardsWrapperRef.current);
                const gapStr = styles.getPropertyValue('gap') || styles.getPropertyValue('column-gap') || '20px';
                const gapPx = parseInt(gapStr);

                const containerWidth = carouselRef.current.offsetWidth;
                const count = Math.floor(containerWidth / (cardWidth + gapPx));

                setItemWidth(cardWidth);
                setGap(gapPx);

                setVisibleItems(count > 0 ? count : 1);
            }
        }

        updateMeasurements();

        window.addEventListener('resize', updateMeasurements);
        return () => window.removeEventListener('resize', updateMeasurements);
    }, []);

    const totalWidth = (itemWidth + gap) * products.length - gap;

    const scrollToPosition = (newPosition) => {
        const boundedPosition = Math.max(0, Math.min(newPosition, products.length - visibleItems));
        setPosition(boundedPosition);
        animate(x, -boundedPosition * (itemWidth + gap), {
            type: 'spring',
            stiffness: 300,
            damping: 30
        });
    };

    const handleScrollLeft = () => {
        scrollToPosition(position - visibleItems);
    };

    const handleScrollRight = () => {
        scrollToPosition(position + visibleItems);
    };

    // Touch and mouse drag events
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(x.get());
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fastness
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        setStartX(touch.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(x.get());
    };

    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        const x = touch.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="relative group">
            {/* Navigation arrows with hover effect */}
            <button
                onClick={handleScrollLeft}
                disabled={position === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${position === 0 ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
                aria-label="Scroll left"
            >
                <FiChevronLeft className="text-gray-700" />
            </button>

            <button
                onClick={handleScrollRight}
                disabled={position >= products.length - visibleItems}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${position >= products.length - visibleItems ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
                aria-label="Scroll right"
            >
                <FiChevronRight className="text-gray-700" />
            </button>

            {/* Carousel container with scroll snap */}
            <div
                ref={carouselRef}
                className="overflow-x-auto py-2 overflow-y-hidden no-scrollbar snap-x snap-mandatory"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseUp}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                style={{
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
            >
                <motion.div
                    ref={cardsWrapperRef}
                    className="flex gap-2 sm:gap-3 xl:gap-5 px-2"
                    style={{
                        x,
                        width: `${totalWidth}px`,
                    }}
                    drag="x"
                    dragConstraints={{
                        left: -totalWidth,
                        right: 0,
                    }}
                    onDragEnd={(e, { offset }) => {
                        const direction = offset.x > 0 ? -1 : 1;
                        const newPosition = position + direction;
                        scrollToPosition(newPosition);
                    }}
                >
                    {products.map((product, index) => (
                        <motion.div
                            key={product._id}
                            ref={index === 0 ? cardRef : null}
                            className="flex-shrink-0 w-40 sm:w-52 snap-start"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default ProductCarousel;