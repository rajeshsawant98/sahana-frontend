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
import { PaginationControls } from "../../components/ui";
import { EventFilters as EventFiltersComponent, BulkArchiveButton } from "../../components/events";
import { fetchAllPublicEvents, fetchAllAdminArchivedEvents } from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import { EventFilters, PaginatedResponse, LegacyEventsResponse } from "../../types/Pagination";
import { useNavigate } from "react-router-dom";
import { 
  createCacheKey, 
  getCachedData, 
  PaginatedCacheData, 
  CACHE_TTL 
} from "../../utils/cacheUtils";

// Helper function to determine if response is paginated
const isPaginatedResponse = (
  response: PaginatedResponse<Event> | LegacyEventsResponse | Event[]
): response is PaginatedResponse<Event> => {
  return 'items' in response;
};

const ManageEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [archivedEvents, setArchivedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingArchived, setLoadingArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isUsingPagination, setIsUsingPagination] = useState(false);
  
  // Separate pagination state for archived events
  const [archivedCurrentPage, setArchivedCurrentPage] = useState(1);
  const [archivedTotalCount, setArchivedTotalCount] = useState(0);
  const [archivedTotalPages, setArchivedTotalPages] = useState(0);
  const [archivedIsUsingPagination, setArchivedIsUsingPagination] = useState(false);
  
  const [filters, setFilters] = useState<EventFilters>({});
  const [activeTab, setActiveTab] = useState<number>(0);
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const cacheKey = createCacheKey.events(currentPage, pageSize, filters);
      
      const cachedData = await getCachedData<Event>(
        cacheKey,
        async () => {
          const params = {
            page: currentPage,
            page_size: pageSize,
            ...filters,
          };
          
          const response = await fetchAllPublicEvents(params);
          
          if (isPaginatedResponse(response)) {
            return {
              items: response.items,
              totalCount: response.total_count,
              totalPages: response.total_pages,
              page: response.page,
              pageSize: response.page_size,
              hasNext: response.has_next,
              hasPrevious: response.has_previous,
            };
          } else if (Array.isArray(response)) {
            return {
              items: response,
              totalCount: response.length,
              totalPages: 1,
              page: 1,
              pageSize: response.length,
              hasNext: false,
              hasPrevious: false,
            };
          } else {
            return {
              items: response.events,
              totalCount: response.events.length,
              totalPages: 1,
              page: 1,
              pageSize: response.events.length,
              hasNext: false,
              hasPrevious: false,
            };
          }
        },
        CACHE_TTL.ADMIN_DATA
      );
      
      setEvents(cachedData.items);
      setTotalCount(cachedData.totalCount);
      setTotalPages(cachedData.totalPages);
      setIsUsingPagination(cachedData.totalPages > 1);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const fetchArchivedEventsData = useCallback(async () => {
    if (activeTab !== 1) return; // Only fetch when on archived tab
    
    setLoadingArchived(true);
    try {
      const response = await fetchAllAdminArchivedEvents({ page: archivedCurrentPage, page_size: pageSize });
      
      // Handle different possible response structures
      let events = [];
      if (response.archived_events) {
        events = response.archived_events;
      } else if ((response as any).events) {
        events = (response as any).events;
      } else if (Array.isArray(response)) {
        events = response;
      } else if ((response as any).items) {
        events = (response as any).items;
      } else if ((response as any).data) {
        events = (response as any).data;
      }
      
      setArchivedEvents(events || []); // Ensure we always have an array
      
      // Handle pagination for archived events if provided
      if ((response as any).total_count !== undefined) {
        setArchivedTotalCount((response as any).total_count);
        setArchivedTotalPages((response as any).total_pages || Math.ceil((response as any).total_count / pageSize));
        setArchivedIsUsingPagination((response as any).total_pages > 1);
      } else if ((response as any).count !== undefined) {
        setArchivedTotalCount((response as any).count);
        setArchivedTotalPages(Math.ceil((response as any).count / pageSize));
        setArchivedIsUsingPagination(Math.ceil((response as any).count / pageSize) > 1);
      } else {
        // No pagination info, assume single page
        setArchivedTotalCount(events?.length || 0);
        setArchivedTotalPages(1);
        setArchivedIsUsingPagination(false);
      }
    } catch (err) {
      console.error("Failed to fetch archived events", err);
      setArchivedEvents([]); // Set empty array on error
    } finally {
      setLoadingArchived(false);
    }
  }, [activeTab, archivedCurrentPage, pageSize]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchArchivedEventsData();
    }
  }, [fetchArchivedEventsData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  const handleArchivedPageChange = (page: number) => {
    setArchivedCurrentPage(page);
  };

  const handleArchivedPageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setArchivedCurrentPage(1); // Reset to first page
  };

  const handleFiltersChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
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
      setCurrentPage(1);
    } else {
      setArchivedCurrentPage(1);
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
                {isUsingPagination && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
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
                {archivedIsUsingPagination && (
                  <PaginationControls
                    currentPage={archivedCurrentPage}
                    totalPages={archivedTotalPages}
                    pageSize={pageSize}
                    totalCount={archivedTotalCount}
                    onPageChange={handleArchivedPageChange}
                    onPageSizeChange={handleArchivedPageSizeChange}
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