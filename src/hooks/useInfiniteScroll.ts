import { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollOptions {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number; // Distance from bottom to trigger load (in pixels)
  rootMargin?: string; // Intersection observer root margin
}

export const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
  threshold = 100,
  rootMargin = '100px'
}: InfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const lastElementCallback = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        rootMargin,
        threshold: 0.1
      }
    );
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, onLoadMore, rootMargin]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { lastElementCallback };
};

export default useInfiniteScroll;
