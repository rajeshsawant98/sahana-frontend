import React, { useEffect, useRef } from 'react';

const AnimateSVG = ({ svgMarkup, className = '', style = {}, id = 'animate-svg' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const svg = containerRef.current?.querySelector('svg');
    if (svg && !svg.classList.contains('animated')) {
      svg.classList.add('animated');
    }
  }, [svgMarkup]);

  return (
    <div
      id={id}
      ref={containerRef}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
};

export default AnimateSVG;