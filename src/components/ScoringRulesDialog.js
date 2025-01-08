import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Box, IconButton, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const ScoringRulesDialog = ({ open, onClose }) => {
  const fullRules = [
    {
      title: "Scaled Flex Scoring",
      rules: [
        {
          ownership: "Rostership >= 50% - Extremely Popular",
          multiplier: ".75",
          score: "10 points scored = 7.5 points",
          color: "red",
        },
        {
          ownership: "Rostership 25-50% - Popular",
          multiplier: "1x",
          score: "10 points scored = 10 points",
          color: "black",
        },
        {
          ownership: "Rostership 12.5-25% - Common",
          multiplier: "1.25x",
          score: "10 points scored = 12.5 points",
          color: "lightgreen",
        },
        {
          ownership: "Rostership 5-12.5% - Uncommon",
          multiplier: "1.5x",
          score: "10 points scored = 15 points",
          color: "mediumseagreen",
        },
        {
          ownership: "Rostership .01-5% - Very Uncommon",
          multiplier: "2x",
          score: "10 points scored = 20 points",
          color: "green",
        },
        {
          ownership: "Only Roster With That Player - Unique",
          multiplier: "3x",
          score: "10 points scored = 30 points",
          color: "darkgreen",
        },
      ],
    },
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
    {
      title: "Kicker Scoring",
      rules: [
        "1 pt for each PAT made",
        "-1 pt for each PAT missed",
        ".1 pt for each FG Made Yards (FGY)",
        "-1 pt for each FG missed",
      ],
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Scoring Rules
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "grey.500",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Create a lineup of 12 players aiming to score the most points over the course of the playoffs. Once the playoffs start, you will not be able to change your lineup. You can only select <strong>ONE PLAYER PER TEAM</strong>. So if you choose Lamar Jackson, you cannot also have Derrick Henry in your lineup.
        </Typography>
        <Typography variant="body1" sx={{ my: 2 }}>
          You will select 2 Scaled FLEX's. The scoring of this position is based on how commonly selected that player is. You are rewarded with a higher bonus if the player is less popular in others' rosters. Meaning if you selected Derrick Henry for your scaled flex and he was in 55% of lineups, he would score .75x points over the course of the playoffs, but if you selected Rashod Bateman and you were the only person to have him selected, he would score 3x points each game.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          <strong>Warning:</strong> You get fewer points if you choose an extremely popular player. (Ownership is determined by entire rostership, not just scaled flex position)
        </Typography>
        {fullRules.map((section, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {section.title}
            </Typography>
            {Array.isArray(section.rules) && typeof section.rules[0] === "object" ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ownership</TableCell>
                      <TableCell>Multiplier</TableCell>
                      <TableCell>Score</TableCell>
                    </TableRow>
                  </TableHead>
                <TableBody>
                    {section.rules.map((rule, ruleIndex) => (
                      <TableRow key={ruleIndex}>
                        <TableCell style={rule.color ? { color: rule.color } : {}}>{rule.ownership}</TableCell>
                        <TableCell style={rule.color ? { color: rule.color } : {}}>{rule.multiplier}</TableCell>
                        <TableCell>{rule.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <ul>
                {section.rules.map((rule, ruleIndex) => (
                  <li key={ruleIndex}>
                    <Typography variant="body1">{rule}</Typography>
                  </li>
                ))}
              </ul>
            )}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ScoringRulesDialog;