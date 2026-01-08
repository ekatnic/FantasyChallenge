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
      ownership: ">= 40% - Extremely Popular",
      multiplier: ".6x",
      score: "10 points = 6 points",
      color: "red",
    },
    {
      ownership: "25-40% - Popular",
      multiplier: ".8x",
      score: "10 points = 8 points",
      color: "darkred",
    },
    {
      ownership: "15-25% - Common",
      multiplier: "1x",
      score: "10 points = 10 points",
      color: "black",
    },
    {
      ownership: "10-15% - Uncommon",
      multiplier: "1.3x",
      score: "10 points = 13 points",
      color: "lightgreen",
    },
    {
      ownership: "5-10% - Very Uncommon",
      multiplier: "1.75x",
      score: "10 points = 17.5 points",
      color: "mediumseagreen",
    },
    {
      ownership: "2-5% - Rare",
      multiplier: "2.25x",
      score: "10 points = 22.5 points",
      color: "green",
    },
        {
      ownership: "1-2% - Very Rare",
      multiplier: "2.75x",
      score: "10 points = 27.5 points",
      color: "darkgreen",
    },
    {
      ownership: "Only Entry With That Player - Unique",
      multiplier: "3.5x",
      score: "10 points = 35 points",
      color: "darkgoldenrod",
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
           Meaning if you selected Puka Nacua for your scaled flex and he was in 55% of lineups, he would score .6x points over the course of the playoffs,
            but if you selected Blake Corum and you were the only person to have him selected, he would score 3.5x points each game. 
            
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