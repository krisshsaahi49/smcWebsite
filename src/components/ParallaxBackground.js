// components/ParallaxBackground.js
import React, { useState, useEffect } from 'react';

const ParallaxBackground = ({ image, height }) => {
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => {
    const newOffsetY = window.pageYOffset;
    setOffsetY(newOffsetY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate scale based on the scroll position for zoom effect
  const scale = 1 + offsetY / 5000; // Adjust the divisor for speed of scaling

  return (
    <div 
      style={{
        backgroundImage: `url(${image})`,
        backgroundPosition: 'center',
        backgroundPositionY: `${offsetY * 0.5}px`, // Slower scroll speed
        height: height,
        backgroundSize: `${scale * 100}%`, // Adjust background size for zoom
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        transition: 'background-position 0.7s, background-size 0.7s',
        willChange: 'background-position, background-size', // Optimize for performance
      }}
    />
  );
};

export default ParallaxBackground;
