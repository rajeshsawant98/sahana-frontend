import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Paper,
  Button,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import { Event as EventIcon, Archive } from "@mui/icons-material";
import { NavBar } from "../../components/navigation";
import { PaginationControls, CursorPaginationControls } from "../../components/ui";
import { EventFilters as EventFiltersComponent, BulkArchiveButton } from "../../components/events";
import { fetchAllPublicEventsWithCursor, fetchAllAdminArchivedEventsWithCursor } from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import { EventFilters, CursorPaginatedResponse } from "../../types/Pagination";
import { useNavigate } from "react-router-dom";
import { 
  createCacheKey, 
  getCachedCursorData,
  CursorCacheData,
  CACHE_TTL 
} from "../../utils/cacheUtils";

const ManageEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [archivedEvents, setArchivedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingArchived, setLoadingArchived] = useState(false);
  
  // Cursor pagination state for active events
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const [pageSize, setPageSize] = useState(12);
  
  // Cursor pagination state for archived events
  const [archivedCursor, setArchivedCursor] = useState<string | undefined>(undefined);
  const [archivedNextCursor, setArchivedNextCursor] = useState<string | undefined>(undefined);
  const [archivedPrevCursor, setArchivedPrevCursor] = useState<string | undefined>(undefined);
  const [archivedHasNext, setArchivedHasNext] = useState(false);
  const [archivedHasPrevious, setArchivedHasPrevious] = useState(false);
  const [archivedTotalCount, setArchivedTotalCount] = useState<number | undefined>(undefined);
  
  const [filters, setFilters] = useState<EventFilters>({});
  const [activeTab, setActiveTab] = useState<number>(0);
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const cacheKey = createCacheKey.cursorEvents(cursor || null, pageSize, filters);
      
      const cachedData = await getCachedCursorData<Event>(
        cacheKey,
        async () => {
          const params = {
            cursor: cursor,
            page_size: pageSize,
            ...filters,
          };
          
          const response = await fetchAllPublicEventsWithCursor(params);
          
          return {
            items: response.items,
            nextCursor: response.pagination.next_cursor,
            prevCursor: response.pagination.prev_cursor,
            hasNext: response.pagination.has_next,
            hasPrevious: response.pagination.has_previous,
            pageSize: response.pagination.page_size,
            totalCount: response.pagination.total_count,
          };
        },
        CACHE_TTL.ADMIN_DATA
      );
      
      setEvents(cachedData.items);
      setNextCursor(cachedData.nextCursor);
      setPrevCursor(cachedData.prevCursor);
      setHasNext(cachedData.hasNext);
      setHasPrevious(cachedData.hasPrevious);
      setTotalCount(cachedData.totalCount);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  }, [cursor, pageSize, filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const fetchArchivedEventsData = useCallback(async () => {
    if (activeTab !== 1) return; // Only fetch when on archived tab
    
    setLoadingArchived(true);
    try {
      const cacheKey = createCacheKey.cursorAdminArchivedEvents(archivedCursor || null, pageSize);
      
      const cachedData = await getCachedCursorData<Event>(
        cacheKey,
        async () => {
          const params = {
            cursor: archivedCursor,
            page_size: pageSize,
          };
          
          const response = await fetchAllAdminArchivedEventsWithCursor(params);
          
          return {
            items: response.items,
            nextCursor: response.pagination.next_cursor,
            prevCursor: response.pagination.prev_cursor,
            hasNext: response.pagination.has_next,
            hasPrevious: response.pagination.has_previous,
            pageSize: response.pagination.page_size,
            totalCount: response.pagination.total_count,
          };
        },
        CACHE_TTL.ADMIN_DATA
      );
      
      setArchivedEvents(cachedData.items);
      setArchivedNextCursor(cachedData.nextCursor);
      setArchivedPrevCursor(cachedData.prevCursor);
      setArchivedHasNext(cachedData.hasNext);
      setArchivedHasPrevious(cachedData.hasPrevious);
      setArchivedTotalCount(cachedData.totalCount);
    } catch (err) {
      console.error("Failed to fetch archived events", err);
      setArchivedEvents([]); // Set empty array on error
    } finally {
      setLoadingArchived(false);
    }
  }, [activeTab, archivedCursor, pageSize]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchArchivedEventsData();
    }
  }, [fetchArchivedEventsData]);

  const handleNext = () => {
    if (nextCursor) {
      setCursor(nextCursor);
    }
  };

  const handlePrevious = () => {
    if (prevCursor) {
      setCursor(prevCursor);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCursor(undefined); // Reset to first page
  };

  const handleArchivedNext = () => {
    if (archivedNextCursor) {
      setArchivedCursor(archivedNextCursor);
    }
  };

  const handleArchivedPrevious = () => {
    if (archivedPrevCursor) {
      setArchivedCursor(archivedPrevCursor);
    }
  };

  const handleArchivedPageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setArchivedCursor(undefined); // Reset to first page
  };

  const handleFiltersChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
    setCursor(undefined); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({});
    setCursor(undefined);
  };

  const handleBulkArchiveSuccess = (archivedCount: number) => {
    // Refresh the events list since some may have been archived
    fetchEvents();
    // Also refresh archived events if we're viewing that tab
    if (activeTab === 1) {
      fetchArchivedEventsData();
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Reset pagination when switching tabs
    if (newValue === 0) {
      setCursor(undefined);
    } else {
      setArchivedCursor(undefined);
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
          <Typography variant="h4" gutterBottom>
            Manage Events
          </Typography>
          <BulkArchiveButton onBulkArchiveSuccess={handleBulkArchiveSuccess} />
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}
        >
          <Tab label="Active Events" icon={<EventIcon />} iconPosition="start" />
          <Tab label="Archived Events" icon={<Archive />} iconPosition="start" />
        </Tabs>

        {/* Filters - only show for active events */}
        {activeTab === 0 && (
          <EventFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        )}

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {activeTab === 0 && (
              <>
                <Paper sx={{ mt: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Created By</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.eventId} sx={{ opacity: event.isArchived ? 0.6 : 1 }}>
                          <TableCell>{event.eventName}</TableCell>
                          <TableCell>{event.createdByEmail}</TableCell>
                          <TableCell>
                            {new Date(event.startTime).toLocaleString()}
                          </TableCell>
                          <TableCell>{event.location?.city || "Online"}</TableCell>
                          <TableCell>
                            {event.isArchived ? (
                              <Chip label="Archived" size="small" color="warning" />
                            ) : (
                              <Chip label="Active" size="small" color="success" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/events/${event.eventId}`)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>

                {/* Pagination Controls for Active Events */}
                {(hasNext || hasPrevious) && (
                  <CursorPaginationControls
                    pageSize={pageSize}
                    totalCount={totalCount}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onPageSizeChange={handlePageSizeChange}
                    currentPageItemsCount={events.length}
                  />
                )}
              </>
            )}

            {activeTab === 1 && (
              <>
                {loadingArchived ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Paper sx={{ mt: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Created By</TableCell>
                          <TableCell>Start Time</TableCell>
                          <TableCell>City</TableCell>
                          <TableCell>Archived Date</TableCell>
                          <TableCell>Archive Reason</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {archivedEvents && archivedEvents.length > 0 ? (
                          archivedEvents.map((event) => (
                            <TableRow key={event.eventId} sx={{ opacity: 0.8 }}>
                              <TableCell>{event.eventName}</TableCell>
                              <TableCell>{event.createdByEmail}</TableCell>
                              <TableCell>
                                {new Date(event.startTime).toLocaleString()}
                              </TableCell>
                              <TableCell>{event.location?.city || "Online"}</TableCell>
                              <TableCell>
                                {event.archivedAt ? new Date(event.archivedAt).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                {event.archiveReason || 'No reason provided'}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => navigate(`/events/${event.eventId}`)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No archived events found
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Paper>
                )}

                {/* Pagination Controls for Archived Events */}
                {(archivedHasNext || archivedHasPrevious) && (
                  <CursorPaginationControls
                    pageSize={pageSize}
                    totalCount={archivedTotalCount}
                    hasNext={archivedHasNext}
                    hasPrevious={archivedHasPrevious}
                    onNext={handleArchivedNext}
                    onPrevious={handleArchivedPrevious}
                    onPageSizeChange={handleArchivedPageSizeChange}
                    currentPageItemsCount={archivedEvents.length}
                  />
                )}
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default ManageEvents;