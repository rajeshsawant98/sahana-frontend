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
} from "@mui/material";
import NavBar from "../../components/NavBar";
import PaginationControls from "../../components/PaginationControls";
import EventFiltersComponent from "../../components/EventFilters";
import { fetchAllAdminEvents } from "../../apis/eventsAPI";
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
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isUsingPagination, setIsUsingPagination] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({});
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const cacheKey = createCacheKey.adminEvents(currentPage, pageSize, filters);
      
      const cachedData = await getCachedData<Event>(
        cacheKey,
        async () => {
          const params = {
            page: currentPage,
            page_size: pageSize,
            ...filters,
          };
          
          const response = await fetchAllAdminEvents(params);
          
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  const handleFiltersChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <>
      <NavBar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manage Events
        </Typography>

        {/* Filters */}
        <EventFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Paper sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Action</TableCell>                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.eventId}>
                      <TableCell>{event.eventName}</TableCell>
                      <TableCell>{event.createdByEmail}</TableCell>
                      <TableCell>
                        {new Date(event.startTime).toLocaleString()}
                      </TableCell>
                      <TableCell>{event.location?.city || "Online"}</TableCell>
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

            {/* Pagination Controls */}
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
      </Box>
    </>
  );
};

export default ManageEvents;