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
    { position: "1st", amount: "50% of pot" },
    { position: "2nd", amount: "15% of pot" },
    { position: "3rd", amount: "10% of pot" },
    { position: "4th", amount: "8% of pot" },
    { position: "5th", amount: "5% of pot" },
    { position: "6th-10th", amount: "$20" },
    { position: "Last Place*", amount: "$20" },
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
        <strong>1.5 pts per Reception by TEs</strong>,
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
        {/* Build Your Roster and New Rules */}
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            flex: "1 1 calc(33% - 16px)",
            minWidth: "280px",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            <strong>Build Your Roster:</strong>
          </Typography>
          <Typography gutterBottom>
            Create a lineup of 12 players. Once the playoffs start you will not be able to change your lineup.
          </Typography>
          <Typography gutterBottom>
            The catch is that you can only select ONE PLAYER PER TEAM. So if you choose Lamar Jackson you cannot also have Derrick Henry in your lineup.
          </Typography>
          <Typography variant="h5" align="center" gutterBottom>
            <strong>New Rules:</strong>
          </Typography>
          <ScaledFlexRulesTable />
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
                    {section.rules.map((rule, ruleIndex) => (
                      <TableRow key={ruleIndex}>
                        <TableCell>{rule}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
            </Box>
          ))}
        </Paper>

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
          <Typography gutterBottom>
            Payouts determined by number of entries. Expected payout will be something like...
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
          <Typography variant="body2" sx={{ mt: 2 }}>
            Around 1% of the pot will be used to pay web hosting fees.
          </Typography>
        </Paper>
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <Link href="/my-entries" underline="none">
          Return to Home
        </Link>
      </Box>
    </Container>
  );
}