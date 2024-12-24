import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "./auth/LogoutButton";

export default function ProtectedHome() {
  const { user } = useAuth();

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>
        Welcome back, {user?.email}! This is a protected dashboard.
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Only authenticated users can see this page.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <LogoutButton />
      </Box>
    </Paper>
  );
}
