import { useState, useEffect, useRef } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

interface PriceDropdownProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

const PriceDropdown = ({ minPrice, maxPrice, onPriceChange }: PriceDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState({
    from: minPrice,
    to: maxPrice,
  });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSelectedPrice({
      from: minPrice,
      to: maxPrice,
    });
  }, [minPrice, maxPrice]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.08)]">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className="flex cursor-pointer items-center justify-between border-b border-blue-light-4/50 bg-gradient-to-r from-blue-light-5/80 to-white px-5 py-3.5"
      >
        <p className="font-bold text-dark">Price</p>
        <button
          onClick={() => setToggleDropdown(!toggleDropdown)}
          id="price-dropdown-btn"
          aria-label="button for price dropdown"
          className={`text-dark ease-out duration-200 ${
            toggleDropdown && 'rotate-180'
          }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      {/* // <!-- dropdown menu --> */}
      <div className={`px-5 py-4 ${toggleDropdown ? "block" : "hidden"}`}>
        <div id="pricingOne">
          <div className="price-range">
            <RangeSlider
              id="range-slider-gradient"
              className="margin-lg"
              min={0}
              max={10000}
              step={100}
              value={[selectedPrice.from, selectedPrice.to]}
              onInput={(e) => {
                const newPrice = {
                  from: Math.floor(e[0]),
                  to: Math.ceil(e[1]),
                };
                // Update local state immediately for responsive UI
                setSelectedPrice(newPrice);
                
                // Clear existing debounce timer
                if (debounceTimerRef.current) {
                  clearTimeout(debounceTimerRef.current);
                }
                
                // Debounce the URL update (500ms delay)
                debounceTimerRef.current = setTimeout(() => {
                  onPriceChange(newPrice.from, newPrice.to);
                }, 500);
              }}
            />

            <div className="price-amount flex items-center justify-between pt-4">
              <div className="flex rounded-xl border border-blue-light-4 text-custom-xs text-dark-4">
                <span className="block border-r border-blue-light-4 bg-blue-light-5 px-2.5 py-1.5">₹</span>
                <span id="minAmount" className="block px-3 py-1.5 font-medium text-dark">
                  {selectedPrice.from.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex rounded-xl border border-blue-light-4 text-custom-xs text-dark-4">
                <span className="block border-r border-blue-light-4 bg-blue-light-5 px-2.5 py-1.5">₹</span>
                <span id="maxAmount" className="block px-3 py-1.5 font-medium text-dark">
                  {selectedPrice.to.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDropdown;
