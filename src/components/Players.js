import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Link,
} from "@mui/material";

// const Players = () => {
export default function Players() {
  // placeholder data
  const mockData = [
    {
      id: 1,
      name: "John Doe",
      team: "Team A",
      position: "QB",
      rosterPercentage: "50%",
      captainPercentage: "10%",
      scaledFlexPercentage: "5%",
      scaledFlexMultiplier: 1.2,
      WC: 10,
      DIV: 15,
      CONF: 20,
      SB: 25,
      total: 70,
    },
    {
      id: 2,
      name: "Jane Smith",
      team: "Team B",
      position: "RB",
      rosterPercentage: "60%",
      captainPercentage: "15%",
      scaledFlexPercentage: "10%",
      scaledFlexMultiplier: 1.5,
      WC: 15,
      DIV: 20,
      CONF: 25,
      SB: 30,
      total: 90,
    },
  ];

  return (
    <Box sx={{ marginTop: 4, marginBottom: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Player Stats
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Player</b>
              </TableCell>
              <TableCell>
                <b>Team</b>
              </TableCell>
              <TableCell>
                <b>Position</b>
              </TableCell>
              <TableCell>
                <b>Roster %</b>
              </TableCell>
              <TableCell>
                <b>Captain %</b>
              </TableCell>
              <TableCell>
                <b>Scaled Flex %</b>
              </TableCell>
              <TableCell>
                <b>SF Multiplier</b>
              </TableCell>
              <TableCell>
                <b>Wild Card</b>
              </TableCell>
              <TableCell>
                <b>Divisional</b>
              </TableCell>
              <TableCell>
                <b>Conference</b>
              </TableCell>
              <TableCell>
                <b>Super Bowl</b>
              </TableCell>
              <TableCell>
                <b>Total Points</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((player) => (
              <TableRow key={player.id}>
                <TableCell>
                  <Link href="#">{player.name}</Link>
                </TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>{player.rosterPercentage}</TableCell>
                <TableCell>{player.captainPercentage}</TableCell>
                <TableCell>{player.scaledFlexPercentage}</TableCell>
                <TableCell>{player.scaledFlexMultiplier}</TableCell>
                <TableCell>{player.WC}</TableCell>
                <TableCell>{player.DIV}</TableCell>
                <TableCell>{player.CONF}</TableCell>
                <TableCell>{player.SB}</TableCell>
                <TableCell>{player.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// export default Players;
