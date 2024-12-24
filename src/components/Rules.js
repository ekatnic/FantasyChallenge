import React from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ScaledFlexRulesTable from "./ScaledFlexRulesTable";

export default function Rules() {
  const payouts = [
    { position: "1st", amount: "$1250" },
    { position: "2nd", amount: "$500" },
    { position: "3rd", amount: "$350" },
    { position: "4th", amount: "$125" },
    { position: "5th", amount: "$125" },
    { position: "6th", amount: "$75" },
    { position: "7th", amount: "$75" },
    { position: "8th", amount: "$75" },
    { position: "9th", amount: "$75" },
    { position: "10th", amount: "$50" },
    { position: "11th", amount: "$20" },
    { position: "12th", amount: "$20" },
    { position: "13th", amount: "$20" },
    { position: "14th", amount: "$20" },
    { position: "15th", amount: "$20" },
    { position: "Last Place", amount: "$20" },
  ];

  // Full rules stored in a variable as an array of objects
  const fullRules = [
    {
      title: "Offense Scoring",
      rules: [
        "4 pts for Passing TDs",
        "6 pts for non Passing TDs",
        "1 pt for every 20 Yards Passing",
        "-1 pt for every Interception Thrown",
        "-1 pt for every Fumble Lost",
        "1 pt for every 10 Rushing or Receiving yards",
        "1 pt per Reception by RBs and WRs",
        "1.5 pts per Reception by TEs",
        "2 pts for every 2 Point Conversion",
      ],
    },
    {
      title: "Defense Scoring",
      rules: [
        "1 pt for every Sack",
        "2 pts for every Interception",
        "2 pts for every Fumble Recovery",
        "5 pts for every Safety",
        "6 pts for every Defensive/ST TD",
        "12 pts for a Shutout",
        "8 pts for allowing 1-6 points",
        "5 pts for allowing 7-10 points",
      ],
    },
  ];

  // Scaled FLEX Scoring stored in a variable
  const scaledFlexScoring = [
    {
      ownership: "50% or more",
      multiplier: "No multiplier",
      score: "10 points = 10 points",
    },
    { ownership: "25-50%", multiplier: "1.2x", score: "10 points = 12 points" },
    {
      ownership: "12.5-25%",
      multiplier: "1.3x",
      score: "10 points = 13 points",
    },
    {
      ownership: "5-12.5%",
      multiplier: "1.5x",
      score: "10 points = 15 points",
    },
    {
      ownership: "0-5%",
      multiplier: "1.75x",
      score: "10 points = 17.5 points",
    },
  ];

  return (
    <Container sx={{ marginTop: 4, marginBottom: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Challenge Rules
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Payouts */}
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            flex: "1 1 calc(33% - 16px)",
            minWidth: "280px",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            <strong>Payouts:</strong>
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Position</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Amount</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payouts.map((payout, index) => (
                  <TableRow key={index}>
                    <TableCell>{payout.position}</TableCell>
                    <TableCell align="right">{payout.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Full Rules */}
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            flex: "1 1 calc(33% - 16px)",
            minWidth: "280px",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            <strong>Full Rules:</strong>
          </Typography>
          {fullRules.map((section, index) => (
            <Box key={index}>
              <Typography variant="h6" gutterBottom>
                {section.title}:
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    {section.rules.map((rule, index) => (
                      <TableRow key={index}>
                        <TableCell>{rule}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Paper>

        {/* New Rules */}
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            flex: "1 1 calc(33% - 16px)",
            minWidth: "280px",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            <strong>New Rules:</strong>
          </Typography>
          <Typography variant="h6">
            <strong>Captain:</strong>
          </Typography>
          <Typography gutterBottom>
            You will select <strong>1 captain</strong> - this can be any
            position other than QB. This player will receive{" "}
            <strong>1.5x points</strong> each week.
          </Typography>
          {/* Scaled FLEX Scoring */}
          <ScaledFlexRulesTable />
        </Paper>
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <Link href="/user-home" underline="none">
          Return to Home
        </Link>
      </Box>
    </Container>
  );
}
