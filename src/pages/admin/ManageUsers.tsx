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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { NavBar } from "../../components/navigation";
import { PaginationControls } from "../../components/ui";
import { User } from "../../types/User";
import { fetchAllUsers } from "../../apis/adminAPI";
import { PaginatedResponse, LegacyUsersResponse, UserFilters } from "../../types/Pagination";
import { 
  createCacheKey, 
  getCachedData, 
  PaginatedCacheData, 
  CACHE_TTL 
} from "../../utils/cacheUtils";

// Helper function to determine if response is paginated
const isPaginatedResponse = (
  response: PaginatedResponse<User> | LegacyUsersResponse | User[]
): response is PaginatedResponse<User> => {
  return 'items' in response;
};

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isUsingPagination, setIsUsingPagination] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({});

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const cacheKey = createCacheKey.adminUsers(currentPage, pageSize, filters);
      
      const cachedData = await getCachedData<User>(
        cacheKey,
        async () => {
          const params = {
            page: currentPage,
            page_size: pageSize,
            ...filters,
          };
          
          const response = await fetchAllUsers(params);
          
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
              items: response.users,
              totalCount: response.users.length,
              totalPages: 1,
              page: 1,
              pageSize: response.users.length,
              hasNext: false,
              hasPrevious: false,
            };
          }
        },
        CACHE_TTL.ADMIN_DATA
      );
      
      setUsers(cachedData.items);
      setTotalCount(cachedData.totalCount);
      setTotalPages(cachedData.totalPages);
      setIsUsingPagination(cachedData.totalPages > 1);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleFilterChange = (field: keyof UserFilters, value: string) => {
    const newFilters = { ...filters };
    if (value === '') {
      delete newFilters[field];
    } else {
      newFilters[field] = value;
    }
    handleFiltersChange(newFilters);
  };

  return (
    <>
      <NavBar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manage Users
        </Typography>

        {/* User Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select
                  value={filters.role || ''}
                  label="Role"
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="moderator">Moderator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Profession"
                value={filters.profession || ''}
                onChange={(e) => handleFilterChange('profession', e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Paper sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.email}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {user.location
                          ? `${user.location.city}, ${user.location.state}`
                          : "N/A"}
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

export default ManageUsers;