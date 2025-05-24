import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce.js';

const PriceRangeSlider = ({ min = 0, max = 25000, value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value[1]);
  const debouncedValue = useDebounce(sliderValue, 500);

  useEffect(() => {
    setSliderValue(value[1]);
  }, [value[1]]);

  useEffect(() => {
    onChange([value[0], debouncedValue]);
  }, [debouncedValue]);

  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        value={sliderValue}
        onChange={(e) => setSliderValue(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between mt-2">
        <span>₹{value[0]}</span>
        <span>₹{sliderValue}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;