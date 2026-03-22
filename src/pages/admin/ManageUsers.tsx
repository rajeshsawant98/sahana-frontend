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
  Container,
  Chip,
  Avatar,
  InputAdornment,
  IconButton,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { People, Search, ArrowBack } from "@mui/icons-material";
import { NavBar } from "../../components/navigation";
import { PaginationControls } from "../../components/ui";
import { User } from "../../types/User";
import { fetchAllUsers } from "../../apis/adminAPI";
import { PaginatedResponse, LegacyUsersResponse, UserFilters } from "../../types/Pagination";
import {
  createCacheKey,
  getCachedData,
  PaginatedCacheData,
  CACHE_TTL,
} from "../../utils/cacheUtils";
import { useNavigate } from "react-router-dom";

// Helper function to determine if response is paginated
const isPaginatedResponse = (
  response: PaginatedResponse<User> | LegacyUsersResponse | User[]
): response is PaginatedResponse<User> => {
  return 'items' in response;
};

const roleConfig: Record<string, { color: 'default' | 'primary' | 'secondary' | 'warning' | 'info'; label: string }> = {
  admin: { color: 'warning', label: 'Admin' },
  moderator: { color: 'info', label: 'Moderator' },
  user: { color: 'default', label: 'User' },
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
  const navigate = useNavigate();

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
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
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

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
                Users
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 191, 73, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFBF49',
                }}
              >
                <People sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                  Manage Users
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {totalCount > 0 ? `${totalCount} total user${totalCount !== 1 ? 's' : ''}` : 'Loading...'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Filters */}
          <Box
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: '16px',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
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

              <TextField
                label="Profession"
                value={filters.profession || ''}
                onChange={(e) => handleFilterChange('profession', e.target.value)}
                size="small"
                sx={{ minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Table */}
          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress sx={{ color: '#FFBF49' }} />
            </Box>
          ) : users.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 10,
                borderRadius: '16px',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <People sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.4 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No users found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters to see more results.
              </Typography>
            </Box>
          ) : (
            <>
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
                      <TableCell sx={tableHeaderSx}>User</TableCell>
                      <TableCell sx={tableHeaderSx}>Email</TableCell>
                      <TableCell sx={tableHeaderSx}>Role</TableCell>
                      <TableCell sx={tableHeaderSx}>Location</TableCell>
                      <TableCell sx={tableHeaderSx}>Profession</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow
                        key={user.email}
                        sx={{
                          backgroundColor: index % 2 === 0 ? 'transparent' : 'action.hover',
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              src={user.profile_picture}
                              sx={{
                                width: 36,
                                height: 36,
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                bgcolor: '#FFBF49',
                                color: '#000',
                              }}
                            >
                              {getInitials(user.name)}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {user.name || 'Unnamed'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={roleConfig[user.role]?.label || user.role}
                            color={roleConfig[user.role]?.color || 'default'}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 24,
                              ...(user.role === 'admin' && {
                                backgroundColor: 'rgba(255, 191, 73, 0.15)',
                                color: '#FFBF49',
                              }),
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {user.location
                              ? `${user.location.city || ''}${user.location.city && user.location.state ? ', ' : ''}${user.location.state || ''}`
                              : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {user.profession || '—'}
                          </Typography>
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
        </Container>
      </Box>
    </>
  );
};

export default ManageUsers;