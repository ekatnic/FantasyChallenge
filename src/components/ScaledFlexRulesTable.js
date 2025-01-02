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
      ownership: ">= 50% - Extremely Popular",
      multiplier: ".75",
      score: "10 points = 7.5 points",
      color: "red",
    },
    {
      ownership: "25-50% - Popular",
      multiplier: "1x",
      score: "10 points = 10 points",
      color: "black",
    },
    {
      ownership: "12.5-25% - Common",
      multiplier: "1.25x",
      score: "10 points = 12.5 points",
      color: "lightgreen",
    },
    {
      ownership: "5-12.5% - Uncommon",
      multiplier: "1.5x",
      score: "10 points = 15 points",
      color: "mediumseagreen",
    },
    {
      ownership: ".01-5% - Very Uncommon",
      multiplier: "2x",
      score: "10 points = 20 points",
      color: "green",
    },
    {
      ownership: "Only Entry With That Player - Unique",
      multiplier: "3x",
      score: "10 points = 30 points",
      color: "darkgreen",
    },
  ];

  return (
    <>
      <Typography variant="h6">
        <strong>Scaled FLEX:</strong>
      </Typography>
      <Typography gutterBottom>
        You will select <strong>2 Scaled FLEX's</strong> - this position is based
        on the ownership % of each player.
      </Typography>
      <Typography gutterBottom>
        You are rewarded with a higher bonus if the player is less popular in others' rosters. 
        <strong style={{ color: "red" }}> Warning: You will get fewer points if you choose an extremely popular player</strong>
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
                  <TableCell align="center" style={{ color: row.color }}>
                    {row.multiplier}
                  </TableCell>
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