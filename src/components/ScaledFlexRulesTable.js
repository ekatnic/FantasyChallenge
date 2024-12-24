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
} from "@mui/material";

export default function ScaledFlexRulesTable() {
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
    <>
      <Typography variant="h6">
        <strong>Scaled FLEX:</strong>
      </Typography>
      <Typography gutterBottom>
        You will select <strong>1 Scaled FLEX</strong> - this position is based
        on the ownership % of each player.
      </Typography>
      <Typography gutterBottom>
        You are rewarded with a higher bonus if the player is less selected by
        others.
      </Typography>
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Ownership</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Multiplier</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Score</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scaledFlexScoring.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.ownership}</TableCell>
                  <TableCell align="center">{row.multiplier}</TableCell>
                  <TableCell align="right">{row.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
