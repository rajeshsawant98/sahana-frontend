import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Chip,
  IconButton,
  Paper,
  Collapse,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ClearIcon from '@mui/icons-material/Clear';
import { EventFilters } from '../types/Pagination';

interface EventFiltersProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  onClearFilters: () => void;
  showExpanded?: boolean;
}

const categories = [
  'Art', 'Fitness', 'Food', 'Gaming', 'History', 'Literature', 
  'Music', 'Outdoors', 'Shopping', 'Sports', 'Technology', 'Travel'
];

const EventFiltersComponent: React.FC<EventFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  showExpanded = false,
}) => {
  const [expanded, setExpanded] = React.useState(showExpanded);

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && value !== null
  ).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: expanded ? 2 : 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="action" />
          <Typography variant="h6">Filters</Typography>
          {hasActiveFilters && (
            <Chip 
              label={`${activeFiltersCount} active`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {hasActiveFilters && (
            <IconButton size="small" onClick={onClearFilters} title="Clear all filters">
              <ClearIcon />
            </IconButton>
          )}
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="City"
              value={filters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="State"
              value={filters.state || ''}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category || ''}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Creator Email"
              value={filters.creator_email || ''}
              onChange={(e) => handleFilterChange('creator_email', e.target.value)}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={filters.start_date ? filters.start_date.split('T')[0] : ''}
              onChange={(e) => handleFilterChange('start_date', e.target.value ? new Date(e.target.value).toISOString() : '')}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={filters.end_date ? filters.end_date.split('T')[0] : ''}
              onChange={(e) => handleFilterChange('end_date', e.target.value ? new Date(e.target.value).toISOString() : '')}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.is_online || false}
                  onChange={(e) => handleFilterChange('is_online', e.target.checked)}
                />
              }
              label="Online Events Only"
            />
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default EventFiltersComponent;
