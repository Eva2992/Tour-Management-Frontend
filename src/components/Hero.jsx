import { useState, useEffect } from 'react';
import bg1 from '../assets/bg1.jpg';
import bg2 from '../assets/bg2.jpg';
import bg3 from '../assets/bg3.jpg';
import bg4 from '../assets/bg4.jpg';
const backgrounds = [bg1, bg2, bg3, bg4];

const Hero = ({ setSearchName }) => {
  const [bgIndex, setBgIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');

  // Rotate background every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchName(inputValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue, setSearchName]);

  return (
    <div
      className="relative w-full min-h-[600px] overflow-hidden flex items-center justify-center pt-12 pb-12"
    >
      {/* Background Image */}
      <img
        src={backgrounds[bgIndex]}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl w-full">
        {/* Main Title */}
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-12 drop-shadow-lg">
          Explore Your Next Destination
        </h1>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-600 text-xl">
            🔍
          </div>
          <input
            type="text"
            value={inputValue}
            placeholder="Search destinations..."
            className="w-full pl-14 pr-6 py-4 rounded-full bg-white border-2 border-emerald-300 focus:outline-none focus:border-emerald-500 transition-colors duration-200 text-gray-800 font-semibold shadow-lg"
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl font-bold text-white drop-shadow-md mb-12">
          Discover breathtaking tours around the world. Adventure awaits!
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-slide-in {
          animation: fadeSlideIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Hero;