'use client';
import { useState, useEffect, RefObject } from 'react';

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    // Also listen for print mode changes
    const handlePrintChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', handlePrintChange);

    return () => {
        window.removeEventListener("resize", listener);
        media.removeEventListener('change', handlePrintChange);
    }
  }, [matches, query]);
  return matches;
};

export const useIntersectionObserver = (
  ref: RefObject<Element>,
  options: IntersectionObserverInit = { root: null, rootMargin: '0px', threshold: 0.1 }
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        // No need to unobserve, animation should only happen once
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isIntersecting;
};
