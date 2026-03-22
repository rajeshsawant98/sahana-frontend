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
  Container,
  Breadcrumbs,
  Link,
  Tooltip,
} from "@mui/material";
import { Event as EventIcon, Archive, ArrowBack, Visibility } from "@mui/icons-material";
import { NavBar } from "../../components/navigation";
import { CursorPaginationControls } from "../../components/ui";
import { EventFilters as EventFiltersComponent, BulkArchiveButton } from "../../components/events";
import { fetchAllPublicEventsWithCursor, fetchAllAdminArchivedEventsWithCursor } from "../../apis/eventsAPI";
import { Event } from "../../types/Event";
import { EventFilters, CursorPaginatedResponse } from "../../types/Pagination";
import { useNavigate } from "react-router-dom";
import {
  createCacheKey,
  getCachedCursorData,
  CursorCacheData,
  CACHE_TTL,
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
    if (activeTab !== 1) return;

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
      setArchivedEvents([]);
    } finally {
      setLoadingArchived(false);
    }
  }, [activeTab, archivedCursor, pageSize]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchArchivedEventsData();
    }
  }, [fetchArchivedEventsData]);

  const handleNext = () => { if (nextCursor) setCursor(nextCursor); };
  const handlePrevious = () => { if (prevCursor) setCursor(prevCursor); };
  const handlePageSizeChange = (newPageSize: number) => { setPageSize(newPageSize); setCursor(undefined); };
  const handleArchivedNext = () => { if (archivedNextCursor) setArchivedCursor(archivedNextCursor); };
  const handleArchivedPrevious = () => { if (archivedPrevCursor) setArchivedCursor(archivedPrevCursor); };
  const handleArchivedPageSizeChange = (newPageSize: number) => { setPageSize(newPageSize); setArchivedCursor(undefined); };

  const handleFiltersChange = (newFilters: EventFilters) => { setFilters(newFilters); setCursor(undefined); };
  const handleClearFilters = () => { setFilters({}); setCursor(undefined); };

  const handleBulkArchiveSuccess = (archivedCount: number) => {
    fetchEvents();
    if (activeTab === 1) fetchArchivedEventsData();
  };

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 0) setCursor(undefined);
    else setArchivedCursor(undefined);
  };

  const tableHeaderSx = {
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: 'text.secondary',
    borderBottom: '2px solid',
    borderColor: 'divider',
    py: 1.5,
  };

  const tabs = [
    { label: 'Active Events', icon: <EventIcon sx={{ fontSize: 16, mr: 0.5 }} /> },
    { label: 'Archived', icon: <Archive sx={{ fontSize: 16, mr: 0.5 }} /> },
  ];

  const renderEventsTable = (
    eventsList: Event[],
    isArchived: boolean,
  ) => (
    <Paper
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={tableHeaderSx}>Event Name</TableCell>
            <TableCell sx={tableHeaderSx}>Created By</TableCell>
            <TableCell sx={tableHeaderSx}>Start Time</TableCell>
            <TableCell sx={tableHeaderSx}>Location</TableCell>
            {isArchived ? (
              <>
                <TableCell sx={tableHeaderSx}>Archived</TableCell>
                <TableCell sx={tableHeaderSx}>Reason</TableCell>
              </>
            ) : (
              <TableCell sx={tableHeaderSx}>Status</TableCell>
            )}
            <TableCell sx={{ ...tableHeaderSx, textAlign: 'right' }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {eventsList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isArchived ? 7 : 6} align="center" sx={{ py: 8 }}>
                <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.4 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No {isArchived ? 'archived ' : ''}events found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isArchived
                    ? 'No events have been archived yet.'
                    : 'Try adjusting your filters to see more results.'}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            eventsList.map((event, index) => (
              <TableRow
                key={event.eventId}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'transparent' : 'action.hover',
                  opacity: isArchived ? 0.85 : 1,
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 191, 73, 0.06)'
                        : 'rgba(255, 191, 73, 0.04)',
                  },
                  '&:last-child td': { borderBottom: 0 },
                }}
              >
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      maxWidth: 220,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {event.eventName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {event.createdByEmail}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(event.startTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
                    {new Date(event.startTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {event.location?.city || "Online"}
                  </Typography>
                </TableCell>
                {isArchived ? (
                  <>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {event.archivedAt
                          ? new Date(event.archivedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={event.archiveReason || 'No reason provided'} arrow>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: 150,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {event.archiveReason || '—'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </>
                ) : (
                  <TableCell>
                    <Chip
                      label={event.isArchived ? "Archived" : "Active"}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 24,
                        ...(event.isArchived
                          ? {
                              backgroundColor: 'rgba(255, 152, 0, 0.12)',
                              color: '#FF9800',
                            }
                          : {
                              backgroundColor: 'rgba(76, 175, 80, 0.12)',
                              color: '#4CAF50',
                            }),
                      }}
                    />
                  </TableCell>
                )}
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Visibility sx={{ fontSize: 16 }} />}
                    onClick={() => navigate(`/events/${event.eventId}`)}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      height: 32,
                      px: 1.5,
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Paper>
  );

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: 'background.default', minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs sx={{ mb: 1.5 }}>
              <Link
                component="button"
                underline="hover"
                onClick={() => navigate('/admin')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  '&:hover': { color: '#FFBF49' },
                }}
              >
                <ArrowBack sx={{ fontSize: 16 }} />
                Admin
              </Link>
              <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Events
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(73, 163, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#49A3FF',
                  }}
                >
                  <EventIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                    Manage Events
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {totalCount !== undefined ? `${totalCount} active event${totalCount !== 1 ? 's' : ''}` : 'Loading...'}
                    {archivedTotalCount !== undefined ? ` · ${archivedTotalCount} archived` : ''}
                  </Typography>
                </Box>
              </Box>
              <BulkArchiveButton onBulkArchiveSuccess={handleBulkArchiveSuccess} />
            </Box>
          </Box>

          {/* Pill Tab Switcher */}
          <Box
            sx={{
              display: 'inline-flex',
              gap: 0.5,
              p: 0.5,
              borderRadius: '12px',
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              mb: 3,
            }}
          >
            {tabs.map((tab, index) => (
              <Box
                key={index}
                onClick={() => handleTabChange(index)}
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: activeTab === index ? 600 : 500,
                  color: activeTab === index ? '#000' : 'text.secondary',
                  backgroundColor: activeTab === index ? '#FFBF49' : 'transparent',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                  '&:hover': {
                    color: activeTab === index ? '#000' : 'text.primary',
                  },
                }}
              >
                {tab.icon}
                {tab.label}
              </Box>
            ))}
          </Box>

          {/* Filters - only show for active events */}
          {activeTab === 0 && (
            <EventFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          )}

          {/* Active Events Tab */}
          {activeTab === 0 && (
            <>
              {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                  <CircularProgress sx={{ color: '#FFBF49' }} />
                </Box>
              ) : (
                <>
                  {renderEventsTable(events, false)}
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
            </>
          )}

          {/* Archived Events Tab */}
          {activeTab === 1 && (
            <>
              {loadingArchived ? (
                <Box display="flex" justifyContent="center" py={8}>
                  <CircularProgress sx={{ color: '#FFBF49' }} />
                </Box>
              ) : (
                <>
                  {renderEventsTable(archivedEvents, true)}
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
        </Container>
      </Box>
    </>
  );
};

export default ManageEvents;