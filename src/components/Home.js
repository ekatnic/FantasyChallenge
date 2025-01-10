import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Paper, Box, Button, Card, CardContent, Link } from "@mui/material";
import EntryNodeGraph from "./EntryNodeGraph";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Paper
      sx={{
        p: 4,
        mt: 4,
        mx: "auto",
        maxWidth: '75%',
        textAlign: "center",
        background: "#f9f9f9",
      }}
      elevation={3}
    >
      <EntryNodeGraph />
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
        }}
      >
        Welcome to the Playoff Challenge
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Compete, Watch, Win!
      </Typography>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" color="warning" onClick={() => navigate("/rules")}>
          Rules
        </Button>
        <Button variant="contained" sx={{ bgcolor: "dodgerblue" }} onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button variant="contained" sx={{ bgcolor: "green" }} onClick={() => navigate("/signup")}>
          Sign Up
        </Button>
      </Box>
      <Card
        sx={{
          mt: 4,
          mb: 2,
          p: 2,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent>
          <Typography variant="body1" gutterBottom sx={{ lineHeight: 1.8 }}>
            Build a lineup of <strong>12 players</strong>—<strong>one player per team</strong>. No drafts, free agency,
            or salary cap! Earn bonus points through the <strong>SCALED FLEX</strong> multiplier and watch your players
            compete in the playoffs.
          </Typography>
          <Box
          sx={{
            textAlign: "center",
              mb: 3,
            
          }}
        >
          <img
            src="https://raw.githubusercontent.com/ekatnic/FantasyChallenge/master/fantasy_football_app/static/images/venmo.PNG"
            alt="Venmo QR Code"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: 8,
            }}
          />
          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 1, color: "#777" }}
          >
            Scan to Venmo @Spenser-Wyatt by kickoff Saturday.
          </Typography>
        </Box>
          <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: "bold" }}>
            Important Deadlines:
          </Typography>
          <Typography variant="body1" gutterBottom>
            Lineups lock at kickoff of the first playoff game:
            <strong> 4:30 PM EST, Saturday, Jan 11th</strong>.
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Live Updates:</strong> Scoring, stats, and standings will be updated live throughout the contest.
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
      <Typography>
        Follow us on{" "}
          <Link
            href="https://twitter.com/ShowdownUpdates"
            underline="hover"
            color="primary"
            target="_blank"
            rel="noopener"
          >
            Twitter
          </Link>{" "}
        </Typography>
         <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Have questions? Contact us at{" "}
          <Link href="mailto:fantasyfootballshowdown@gmail.com">fantasyfootballshowdown@gmail.com</Link>.
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Want to work with us? Email{" "}
          <Link href="mailto:fantasyfootballshowdown@gmail.com">fantasyfootballshowdown@gmail.com</Link>.
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
          Developed by Ethan Katnic, Spenser Wyatt, and Angus Watters.
        </Typography>
      </Box>
    </Paper>
  );
};

export default Home;

