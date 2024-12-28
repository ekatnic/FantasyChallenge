// Needs to be reviewed, this is a GPT generated placeholder

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Link,
} from "@mui/material";

export default function Standings() {
  // Replace w/ api/standings/ api call
  const standingsData = [
    {
      rank: 1,
      name: "Entry 1",
      wildCard: 100,
      divisional: 120,
      conference: 90,
      superBowl: 70,
      total: 380,
      isCurrentUser: true, // Highlight this row for the current user
    },
    {
      rank: 2,
      name: "Entry 2",
      wildCard: 80,
      divisional: 110,
      conference: 95,
      superBowl: 60,
      total: 345,
    },
    {
      rank: 3,
      name: "Entry 3",
      wildCard: 70,
      divisional: 100,
      conference: 85,
      superBowl: 75,
      total: 330,
    },
  ];

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Challenge Standings
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Entry</TableCell>
              <TableCell>Wild Card</TableCell>
              <TableCell>Divisional</TableCell>
              <TableCell>Conference</TableCell>
              <TableCell>Super Bowl</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standingsData.map((entry, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: entry.isCurrentUser
                    ? "rgba(0, 123, 255, 0.2)"
                    : "inherit",
                }}
              >
                <TableCell>{entry.rank}</TableCell>
                <TableCell>
                  <Link href={`/view_entry/${entry.rank}`} underline="hover">
                    {entry.name}
                  </Link>
                </TableCell>
                <TableCell>{entry.wildCard}</TableCell>
                <TableCell>{entry.divisional}</TableCell>
                <TableCell>{entry.conference}</TableCell>
                <TableCell>{entry.superBowl}</TableCell>
                <TableCell>
                  <strong>{entry.total}</strong>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
