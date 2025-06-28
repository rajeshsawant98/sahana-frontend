/**
 * CacheStatus Component - DEVELOPMENT ONLY
 * 
 * This component provides a visual interface for monitoring and managing
 * the cache during development. It displays cache statistics, allows manual
 * cache invalidation, and shows detailed cache entries.
 * 
 * IMPORTANT: This component should only be rendered in development mode.
 * In App.tsx, it's conditionally rendered with: {import.meta.env.DEV && <CacheStatus />}
 * 
 * Features:
 * - Real-time cache statistics
 * - Manual cache invalidation by pattern
 * - Detailed view of cache entries
 * - Collapsible floating UI that doesn't interfere with main app
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { cacheManager, invalidateCache } from '../utils/cacheUtils';

const CacheStatus: React.FC = () => {
  const [stats, setStats] = useState({ totalEntries: 0, expiredEntries: 0 });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      setStats(cacheManager.getStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);

    return () => clearInterval(interval);
  }, [refreshKey]);

  const handleInvalidateAll = () => {
    invalidateCache.all();
    setRefreshKey(prev => prev + 1);
  };

  const handleInvalidateEvents = () => {
    invalidateCache.events();
    setRefreshKey(prev => prev + 1);
  };

  const handleInvalidateUserEvents = () => {
    invalidateCache.userEvents();
    setRefreshKey(prev => prev + 1);
  };

  const handleInvalidateNearbyEvents = () => {
    invalidateCache.nearbyEvents();
    setRefreshKey(prev => prev + 1);
  };

  const handleInvalidateAdminData = () => {
    invalidateCache.adminUsers();
    invalidateCache.adminEvents();
    setRefreshKey(prev => prev + 1);
  };

  // Only show in development environment
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 20, left: 20, zIndex: 9999, maxWidth: 300 }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">
            Cache Status
            <Chip 
              size="small" 
              label={stats.totalEntries} 
              color="primary" 
              sx={{ ml: 1 }} 
            />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="caption" display="block">
                  Total Entries: {stats.totalEntries}
                </Typography>
                <Typography variant="caption" display="block">
                  Expired: {stats.expiredEntries}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                  Cache Controls
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Button 
                  size="small" 
                  onClick={handleInvalidateEvents}
                  fullWidth
                  variant="outlined"
                >
                  Clear Events
                </Button>
              </Grid>
              
              <Grid item xs={6}>
                <Button 
                  size="small" 
                  onClick={handleInvalidateUserEvents}
                  fullWidth
                  variant="outlined"
                >
                  Clear User Events
                </Button>
              </Grid>
              
              <Grid item xs={6}>
                <Button 
                  size="small" 
                  onClick={handleInvalidateNearbyEvents}
                  fullWidth
                  variant="outlined"
                >
                  Clear Nearby
                </Button>
              </Grid>
              
              <Grid item xs={6}>
                <Button 
                  size="small" 
                  onClick={handleInvalidateAdminData}
                  fullWidth
                  variant="outlined"
                >
                  Clear Admin
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  size="small" 
                  onClick={handleInvalidateAll}
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 1 }}
                >
                  Clear All Cache
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CacheStatus;
