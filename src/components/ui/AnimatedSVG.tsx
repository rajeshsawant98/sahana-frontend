import React, { useEffect, useRef } from 'react';
import '../../styles/vendor/group-discussion-styles.css';
import groupDiscussionSVG from '../../assets/group-discussion-not-css.svg?raw';

interface AnimatedSVGProps {
  style?: React.CSSProperties;
  svgMarkup?: string;
  className?: string;
  id?: string;
}

const AnimatedSVG: React.FC<AnimatedSVGProps> = React.memo(({ 
  style, 
  svgMarkup,
  className = '',
  id = 'animated-svg'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef<boolean>(false);

  // Use provided SVG markup or default group discussion SVG
  const svgContent = svgMarkup || groupDiscussionSVG;

  useEffect(() => {
    if (!hasAnimated.current) {
      const svg = containerRef.current?.querySelector('svg');
      if (svg && !svg.classList.contains('animated')) {
        svg.classList.add('animated');
        hasAnimated.current = true;
      }
    }
  }, [svgContent]);

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
      id={id}
      ref={containerRef}
      className={className}
      style={{ ...defaultStyle, ...style }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
});

AnimatedSVG.displayName = 'AnimatedSVG';

export default AnimatedSVG;
