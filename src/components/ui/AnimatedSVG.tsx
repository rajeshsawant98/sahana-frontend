import React, { useEffect, useRef } from 'react';
import '../../styles/vendor/group-discussion-styles.css';
import groupDiscussionSVG from '../../assets/group-discussion-not-css.svg?raw';

interface AnimatedSVGProps {
  style?: React.CSSProperties;
}

const AnimatedSVG: React.FC<AnimatedSVGProps> = ({ style }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = containerRef.current?.querySelector('svg');
    if (svg) svg.classList.add('animated');
  }, []);

  const defaultStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '75%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0,
  };

  return (
    <div
      ref={containerRef}
      style={{ ...defaultStyle, ...style }}
      dangerouslySetInnerHTML={{ __html: groupDiscussionSVG }}
    />
  );
};

export default AnimatedSVG;
