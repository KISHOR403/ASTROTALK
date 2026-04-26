import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]"
      >
        {/* Outer Circle / Eye Shape */}
        <path
          d="M10 50C10 50 30 20 50 20C70 20 90 50 90 50C90 50 70 80 50 80C30 80 10 50 10 50Z"
          stroke="currentColor"
          strokeWidth="4"
          className="text-accent"
          strokeLinecap="round"
        />
        
        {/* Inner Iris / Galaxy Circle */}
        <circle
          cx="50"
          cy="50"
          r="15"
          className="text-accent fill-accent animate-pulse"
        />
        
        {/* Cosmic Pupil / Star */}
        <path
          d="M50 40V60M40 50H60"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Luminous Orbits */}
        <circle
          cx="50"
          cy="50"
          r="30"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 8"
          className="text-accent/30 animate-[spin_10s_linear_infinite]"
        />
      </svg>
    </div>
  );
};

export default Logo;
