import React, { useEffect, useRef } from 'react';
import { animate, stagger as animeStagger } from 'animejs';

export default function AnimeWrapper({
  children,
  animationType = 'fadeUp',
  delay = 0,
  duration = 800,
  className = '',
  stagger = 100
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    try {
      if (animationType === 'fadeUp') {
        animate(el, {
          translateY: [35, 0],
          opacity: [0, 1],
          ease: 'outExpo',
          duration,
          delay
        });
      } else if (animationType === 'staggerChildren') {
        const childrenEls = el.children;
        if (childrenEls && childrenEls.length > 0) {
          animate(childrenEls, {
            translateY: [30, 0],
            opacity: [0, 1],
            ease: 'outQuart',
            duration,
            delay: animeStagger(stagger, { start: delay })
          });
        }
      } else if (animationType === 'float') {
        animate(el, {
          translateY: [-8, 8],
          rotate: [-1, 1],
          duration: 4000,
          ease: 'inOutSine',
          alternate: true,
          loop: true
        });
      }
    } catch (err) {
      console.warn('Anime.js v4 execution warning:', err.message);
    }
  }, [animationType, delay, duration, stagger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
