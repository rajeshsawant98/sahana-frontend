import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface CursorPaginationControlsProps {
  pageSize: number;
  totalCount?: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showResultsCount?: boolean;
  currentPageItemsCount?: number;
}

const CursorPaginationControls: React.FC<CursorPaginationControlsProps> = ({
  pageSize,
  totalCount,
  hasNext,
  hasPrevious,
  onNext,
  onPrevious,
  onPageSizeChange,
  pageSizeOptions = [12, 60, 120],
  showPageSizeSelector = true,
  showResultsCount = true,
  currentPageItemsCount = 0,
}) => {
  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    onPageSizeChange(event.target.value as number);
  };

  if (!hasNext && !hasPrevious && !showResultsCount) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mt: 3,
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {showResultsCount && (
          <Typography variant="body2" color="text.secondary">
            {totalCount !== undefined 
              ? `Showing ${currentPageItemsCount} items (${totalCount} total)`
              : `Showing ${currentPageItemsCount} items`
            }
          </Typography>
        )}
        
        {showPageSizeSelector && (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Per page</InputLabel>
            <Select
              value={pageSize}
              label="Per page"
              onChange={handlePageSizeChange}
            >
              {pageSizeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {(hasNext || hasPrevious) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ChevronLeft />}
            disabled={!hasPrevious}
            onClick={onPrevious}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="small"
            endIcon={<ChevronRight />}
            disabled={!hasNext}
            onClick={onNext}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CursorPaginationControls;
