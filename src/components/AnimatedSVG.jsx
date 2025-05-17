import React, { useEffect, useRef } from 'react';
import '../styles/vendor/group-discussion-styles.css';
import groupDiscussionSVG from '../assets/group-discussion-not-css.svg?raw'; 

const AnimatedSVG = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const svg = containerRef.current?.querySelector('svg');
    if (svg) svg.classList.add('animated');
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '75%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
      }}
      dangerouslySetInnerHTML={{ __html: groupDiscussionSVG }}
    />
  );
};

export default AnimatedSVG;