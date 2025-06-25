import React, { useEffect, useRef } from 'react';

interface AnimateSVGProps {
  svgMarkup: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

const AnimateSVG: React.FC<AnimateSVGProps> = React.memo(({ 
  svgMarkup, 
  className = '', 
  style = {}, 
  id = 'animate-svg' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef<boolean>(false);

  useEffect(() => {
    if (!hasAnimated.current) {
      const svg = containerRef.current?.querySelector('svg');
      if (svg && !svg.classList.contains('animated')) {
        svg.classList.add('animated');
        hasAnimated.current = true;
      }
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
});

AnimateSVG.displayName = 'AnimateSVG';

export default AnimateSVG;
