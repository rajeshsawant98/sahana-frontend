import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface InfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
  loadingMessage?: string;
  endMessage?: string;
  errorMessage?: string;
  error?: boolean;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loading,
  hasMore,
  onLoadMore,
  children,
  loadingMessage = "Loading more events...",
  endMessage = "No more events to load",
  errorMessage = "Failed to load more events",
  error = false,
}) => {
  const { lastElementCallback } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore,
    threshold: 100,
    rootMargin: '200px',
  });

  return (
    <>
      {children}
      
      {/* Intersection trigger element */}
      {hasMore && (
        <Box 
          ref={lastElementCallback}
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 3,
            minHeight: 60
          }}
        >
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">
                {loadingMessage}
              </Typography>
            </Box>
          )}
          {error && (
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
          )}
        </Box>
      )}
      
      {/* End of list message */}
      {!hasMore && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {endMessage}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default InfiniteScroll;
