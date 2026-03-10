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
  // Keep latest values accessible inside the observer without recreating it
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { onLoadMoreRef.current = onLoadMore; }, [onLoadMore]);

  const lastElementCallback = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!node) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin, threshold: 0.1 }
    );

    observerRef.current.observe(node);
  }, [rootMargin]); // observer only recreates if rootMargin changes

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
