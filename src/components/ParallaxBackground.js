import React, { useState, useEffect } from 'react';

const ParallaxBackground = ({ image, height }) => {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.pageYOffset);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Adjust the background position for parallax effect
  const backgroundPositionY = offsetY * 0.5;

  // Subtle zoom effect
  const scale = 1 + (offsetY / 5000); // Adjust the divisor to control the zoom intensity

  return (
    <div 
      style={{
        backgroundImage: `url(${image})`,
        backgroundPosition: 'center',
        backgroundPositionY: `${backgroundPositionY}px`,
        height: height,
        backgroundSize: `${scale * 100}%`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        transition: 'background-position 0.7s ease-out, background-size 0.7s ease-out',
        willChange: 'background-position, background-size',
      }}
    />
  );
};

export default ParallaxBackground;
