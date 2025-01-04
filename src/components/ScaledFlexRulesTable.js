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
        You will select <strong>2 Scaled FLEX's</strong>.
         The scoring of this position is based on how commonly selected that player is.
          You are rewarded with a higher bonus if the player is <strong>less</strong> popular in others' rosters.
          <br/>
           Meaning if you selected Derrick Henry for your scaled flex and he was in 55% of lineups, he would score .75x points over the course of the playoffs,
            but if you selected Rashod Bateman and you were the only person to have him selected, he would score 3x points each game. 
            
            <br/>
            Warning: You get fewer points if you choose an extremely popular player.
              (Ownership is determined by entire rostership, not just scaled flex position)
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