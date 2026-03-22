import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  People,
  Event as EventIcon,
  EventAvailable,
  Archive,
  ArrowForward,
} from "@mui/icons-material";
import { NavBar } from "../../components/navigation";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchAdminStats } from "../../apis/adminAPI";

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  activeEvents: number;
  archivedEvents: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const greeting = useMemo((): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminStats();
      setStats({
        totalUsers: data.total_users,
        totalEvents: data.total_events,
        activeEvents: data.active_events,
        archivedEvents: data.archived_events,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
      setStats({ totalUsers: 0, totalEvents: 0, activeEvents: 0, archivedEvents: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: <People sx={{ fontSize: 28 }} />,
      gradient: "linear-gradient(135deg, #FFBF49 0%, #FFA500 100%)",
      iconBg: "rgba(255, 191, 73, 0.15)",
      iconColor: "#FFBF49",
    },
    {
      label: "Active Events",
      value: stats?.activeEvents ?? 0,
      icon: <EventAvailable sx={{ fontSize: 28 }} />,
      gradient: "linear-gradient(135deg, #49A3FF 0%, #2979FF 100%)",
      iconBg: "rgba(73, 163, 255, 0.15)",
      iconColor: "#49A3FF",
    },
    {
      label: "Archived Events",
      value: stats?.archivedEvents ?? 0,
      icon: <Archive sx={{ fontSize: 28 }} />,
      gradient: "linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%)",
      iconBg: "rgba(255, 107, 107, 0.15)",
      iconColor: "#FF6B6B",
    },
    {
      label: "Total Events",
      value: (stats?.activeEvents ?? 0) + (stats?.archivedEvents ?? 0),
      icon: <EventIcon sx={{ fontSize: 28 }} />,
      gradient: "linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)",
      iconBg: "rgba(162, 155, 254, 0.15)",
      iconColor: "#A29BFE",
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View, filter, and manage all registered users on the platform.",
      icon: <People sx={{ fontSize: 32 }} />,
      path: "/admin/users",
      accentColor: "#FFBF49",
    },
    {
      title: "Manage Events",
      description: "Review active events, filter by category, and manage archived events.",
      icon: <EventIcon sx={{ fontSize: 32 }} />,
      path: "/admin/events",
      accentColor: "#49A3FF",
    },
  ];

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: 'background.default', minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Welcome Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar
                src={user?.profile_picture}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: '#FFBF49',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2 }}
                >
                  {greeting}, {user?.name?.split(' ')[0] || "Admin"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {' · '}Admin Panel
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Stat Cards */}
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress sx={{ color: '#FFBF49' }} />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: 2.5,
                mb: 5,
              }}
            >
              {statCards.map((card) => (
                <Box
                  key={card.label}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: darkMode
                        ? '0 8px 24px rgba(0,0,0,0.4)'
                        : '0 8px 24px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        backgroundColor: card.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: card.iconColor,
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-1px',
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {card.value.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {card.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Quick Actions */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Quick Actions
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2.5,
              }}
            >
              {quickActions.map((action) => (
                <Box
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    '&:hover': {
                      borderColor: action.accentColor,
                      transform: 'translateY(-2px)',
                      boxShadow: darkMode
                        ? `0 8px 24px rgba(0,0,0,0.4)`
                        : `0 8px 24px rgba(0,0,0,0.08)`,
                      '& .action-arrow': {
                        transform: 'translateX(4px)',
                        color: action.accentColor,
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      background: `${action.accentColor}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: action.accentColor,
                      flexShrink: 0,
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.25 }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                      {action.description}
                    </Typography>
                  </Box>
                  <ArrowForward
                    className="action-arrow"
                    sx={{
                      color: 'text.secondary',
                      fontSize: 20,
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AdminDashboard;