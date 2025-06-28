import React, { useEffect, useState } from "react";
import {
  Typography,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Alert,
  Grid2,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import NavBar from "../components/NavBar";
import EventCard from "../components/cards/EventCard";
import PaginationControls from "../components/PaginationControls";
import { 
  fetchCreatedEvents, 
  fetchRSVPedEvents, 
  fetchOrganizedEvents, 
  fetchModeratedEvents,
  setCreatedPage,
  setCreatedPageSize,
  setRSVPedPage,
  setRSVPedPageSize,
  setOrganizedPage,
  setOrganizedPageSize,
  setModeratedPage,
  setModeratedPageSize
} from "../redux/slices/userEventsSlice";

const MyEvents: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);

  const {
    createdEvents,
    loadingCreated,
    errorCreated,
    rsvpedEvents,
    loadingRSVPed,
    errorRSVPed,
    hasFetchedRSVPed,
    organizedEvents,
    loadingOrganized,
    errorOrganized,
    hasFetchedOrganized,
    moderatedEvents,
    loadingModerated,
    errorModerated,
    hasFetchedModerated,
    createdPagination,
    rsvpedPagination,
    organizedPagination,
    moderatedPagination,
  } = useAppSelector((state) => state.userEvents);

  useEffect(() => {
    dispatch(fetchCreatedEvents({ page: createdPagination.currentPage, page_size: createdPagination.pageSize }));
  }, [dispatch, createdPagination.currentPage, createdPagination.pageSize]);
  
  useEffect(() => {
    if (activeTab === 1 && !hasFetchedRSVPed) {
      dispatch(fetchRSVPedEvents({ page: rsvpedPagination.currentPage, page_size: rsvpedPagination.pageSize }));
    } else if (activeTab === 2 && !hasFetchedOrganized) {
      dispatch(fetchOrganizedEvents({ page: organizedPagination.currentPage, page_size: organizedPagination.pageSize }));
    } else if (activeTab === 3 && !hasFetchedModerated) {
      dispatch(fetchModeratedEvents({ page: moderatedPagination.currentPage, page_size: moderatedPagination.pageSize }));
    }
  }, [
    activeTab, dispatch, hasFetchedRSVPed, hasFetchedOrganized, hasFetchedModerated,
    rsvpedPagination.currentPage, rsvpedPagination.pageSize,
    organizedPagination.currentPage, organizedPagination.pageSize,
    moderatedPagination.currentPage, moderatedPagination.pageSize
  ]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Created events pagination handlers
  const handleCreatedPageChange = (page: number) => {
    dispatch(setCreatedPage(page));
    
    // Immediately trigger API call with new page
    dispatch(fetchCreatedEvents({ 
      page: page, 
      page_size: createdPagination.pageSize 
    }));
  };

  const handleCreatedPageSizeChange = (pageSize: number) => {
    dispatch(setCreatedPageSize(pageSize));
    
    // Immediately trigger API call with new page size (page resets to 1)
    dispatch(fetchCreatedEvents({ 
      page: 1, 
      page_size: pageSize 
    }));
  };

  // RSVP'd events pagination handlers
  const handleRSVPedPageChange = (page: number) => {
    dispatch(setRSVPedPage(page));
    
    // Immediately trigger API call with new page
    dispatch(fetchRSVPedEvents({ 
      page: page, 
      page_size: rsvpedPagination.pageSize 
    }));
  };

  const handleRSVPedPageSizeChange = (pageSize: number) => {
    dispatch(setRSVPedPageSize(pageSize));
    
    // Immediately trigger API call with new page size (page resets to 1)
    dispatch(fetchRSVPedEvents({ 
      page: 1, 
      page_size: pageSize 
    }));
  };

  // Organized events pagination handlers
  const handleOrganizedPageChange = (page: number) => {
    dispatch(setOrganizedPage(page));
    
    // Immediately trigger API call with new page
    dispatch(fetchOrganizedEvents({ 
      page: page, 
      page_size: organizedPagination.pageSize 
    }));
  };

  const handleOrganizedPageSizeChange = (pageSize: number) => {
    dispatch(setOrganizedPageSize(pageSize));
    
    // Immediately trigger API call with new page size (page resets to 1)
    dispatch(fetchOrganizedEvents({ 
      page: 1, 
      page_size: pageSize 
    }));
  };

  // Moderated events pagination handlers
  const handleModeratedPageChange = (page: number) => {
    dispatch(setModeratedPage(page));
    
    // Immediately trigger API call with new page
    dispatch(fetchModeratedEvents({ 
      page: page, 
      page_size: moderatedPagination.pageSize 
    }));
  };

  const handleModeratedPageSizeChange = (pageSize: number) => {
    dispatch(setModeratedPageSize(pageSize));
    
    // Immediately trigger API call with new page size (page resets to 1)
    dispatch(fetchModeratedEvents({ 
      page: 1, 
      page_size: pageSize 
    }));
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case 0: return loadingCreated;
      case 1: return loadingRSVPed;
      case 2: return loadingOrganized;
      case 3: return loadingModerated;
      default: return false;
    }
  };

  const getCurrentError = () => {
    switch (activeTab) {
      case 0: return errorCreated;
      case 1: return errorRSVPed;
      case 2: return errorOrganized;
      case 3: return errorModerated;
      default: return null;
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ padding: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
          <Typography variant="h4" gutterBottom>
            My Events
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/events/new")}
            color="primary"
          >
            Create Event
          </Button>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}
        >
          <Tab label="Created" />
          <Tab label="RSVP'd" />
          <Tab label="Organized" />
          <Tab label="Moderated" />
        </Tabs>

        {getCurrentLoading() ? (
          <CircularProgress />
        ) : getCurrentError() ? (
          <Alert severity="error">{getCurrentError()}</Alert>
        ) : (
          <>
            {activeTab === 0 && (
              <>
                {createdEvents.length > 0 ? (
                  <>
                    <Grid2 container spacing={3}>
                      {createdEvents.map((event) => (
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={event.eventId}>
                          <EventCard event={event} />
                        </Grid2>
                      ))}
                    </Grid2>
                    
                    <PaginationControls
                      currentPage={createdPagination.currentPage}
                      totalPages={createdPagination.totalPages}
                      pageSize={createdPagination.pageSize}
                      totalCount={createdPagination.totalCount}
                      onPageChange={handleCreatedPageChange}
                      onPageSizeChange={handleCreatedPageSizeChange}
                    />
                  </>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No events created yet.
                  </Typography>
                )}
              </>
            )}

            {activeTab === 1 && (
              <>
                {rsvpedEvents.length > 0 ? (
                  <>
                    <Grid2 container spacing={3}>
                      {rsvpedEvents.map((event) => (
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={event.eventId}>
                          <EventCard event={event} />
                        </Grid2>
                      ))}
                    </Grid2>
                    
                    <PaginationControls
                      currentPage={rsvpedPagination.currentPage}
                      totalPages={rsvpedPagination.totalPages}
                      pageSize={rsvpedPagination.pageSize}
                      totalCount={rsvpedPagination.totalCount}
                      onPageChange={handleRSVPedPageChange}
                      onPageSizeChange={handleRSVPedPageSizeChange}
                    />
                  </>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No RSVP'd events found.
                  </Typography>
                )}
              </>
            )}

            {activeTab === 2 && (
              <>
                {organizedEvents.length > 0 ? (
                  <>
                    <Grid2 container spacing={3}>
                      {organizedEvents.map((event) => (
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={event.eventId}>
                          <EventCard event={event} />
                        </Grid2>
                      ))}
                    </Grid2>
                    
                    <PaginationControls
                      currentPage={organizedPagination.currentPage}
                      totalPages={organizedPagination.totalPages}
                      pageSize={organizedPagination.pageSize}
                      totalCount={organizedPagination.totalCount}
                      onPageChange={handleOrganizedPageChange}
                      onPageSizeChange={handleOrganizedPageSizeChange}
                    />
                  </>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No organized events found.
                  </Typography>
                )}
              </>
            )}

            {activeTab === 3 && (
              <>
                {moderatedEvents.length > 0 ? (
                  <>
                    <Grid2 container spacing={3}>
                      {moderatedEvents.map((event) => (
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={event.eventId}>
                          <EventCard event={event} />
                        </Grid2>
                      ))}
                    </Grid2>
                    
                    <PaginationControls
                      currentPage={moderatedPagination.currentPage}
                      totalPages={moderatedPagination.totalPages}
                      pageSize={moderatedPagination.pageSize}
                      totalCount={moderatedPagination.totalCount}
                      onPageChange={handleModeratedPageChange}
                      onPageSizeChange={handleModeratedPageSizeChange}
                    />
                  </>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No moderated events found.
                  </Typography>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default MyEvents;
