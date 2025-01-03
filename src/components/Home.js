// components/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Paper, Box, Button } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Playoff Challenge
      </Typography>
      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Create a lineup of 12 players. Once the playoffs start you will not be able to change your lineup. The catch is that you can only select ONE PLAYER PER TEAM.
        </Typography>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <img
            src="https://raw.githubusercontent.com/ekatnic/FantasyChallenge/master/fantasy_football_app/static/images/venmo.PNG"
            alt="Venmo QR Code"
            className="img-fluid"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
        <Typography variant="body1" gutterBottom>
          Please Venmo @Spenser-Wyatt by kickoff Saturday. Payouts will be determined as a percentage after all entries have been locked. Check out the full rules <a href="/rules">here</a>. Standings will be available after the first game kicks off. Check out <a href="https://twitter.com/ShowdownUpdates">our Twitter</a> for updates on the competition. Any questions please reach out: spenserjwyatt@gmail.com
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Website developed by Ethan Katnic and Angus Watters.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/rules")}>
          Rules
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate("/signup")}>
          Sign Up
        </Button>
      </Box>
    </Paper>
  );
};

export default Home;
