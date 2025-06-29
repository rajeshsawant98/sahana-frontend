import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { NavBar } from "../../components/navigation";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <Button variant="contained" onClick={() => navigate("/admin/users")}>Manage Users</Button>
        <Button variant="contained" onClick={() => navigate("/admin/events")} sx={{ ml: 2 }}>Manage Events</Button>
      </Box>
    </>
  );
};

export default AdminDashboard;