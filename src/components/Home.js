// components/Home.js
import React from "react";
import { Typography, Paper } from "@mui/material";

const Home = () => {
  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the 2025 Fantasy Playoff Showdown
      </Typography>
      <Typography variant="body1">
        This is the public home page that anyone can see.
      </Typography>
    </Paper>
  );
};

export default Home;
