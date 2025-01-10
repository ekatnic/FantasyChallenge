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
        {
          game_event: "Passing TD",
          points: "4"
        },
        {
          game_event: "Non-Passing TD",
          points: "6"
        },
        {
          game_event: "Passing Yards",
          points: "1"
        },
        {
          game_event: "Interception Thrown",
          points: "-1"
        },
        {
          game_event: "Fumble Lost",
          points: "-1"
        },
        {
          game_event: "Rushing/Receiving Yards",
          points: "1"
        },
        {
          game_event: "RB/WR Reception",
          points: "1"
        },
        {
          game_event: "TE Reception",
          points: "1.5"
        },
        {
          game_event: "2-Point Conversion",
          points: "2"
        }
      ]
    },
    {
      title: "Defense Scoring",
      rules: [
        {
          game_event: "Sack",
          points: "1"
        },
        {
          game_event: "Interception",
          points: "2"
        },
        {
          game_event: "Fumble Recovery",
          points: "2"
        },
        {
          game_event: "Safety",
          points: "5"
        },
        {
          game_event: "Defensive/ST TD",
          points: "6"
        },
        {
          game_event: "Shutout",
          points: "12"
        },
        {
          game_event: "Points Allowed (1-6)",
          points: "8"
        },
        {
          game_event: "Points Allowed (7-10)",
          points: "5"
        }
      ]
    },
    {
      title: "Kicker Scoring",
      rules: [
        {
          game_event: "PAT Made",
          points: "1"
        },
        {
          game_event: "PAT Missed",
          points: "-1"
        },
        {
          game_event: "Field Goal Made",
          points: "0.1"
        },
        {
          game_event: "Field Goal Missed",
          points: "-1"
        }
      ]
    }
  ];

  const renderTable = (section) => {
    if (section.title === "Scaled Flex Scoring") {
      return (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Ownership</strong></TableCell>
                <TableCell><strong>Multiplier</strong></TableCell>
                <TableCell><strong>Score</strong></TableCell>
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
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell><strong>Points</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {section.rules.map((rule, ruleIndex) => (
              <TableRow key={ruleIndex}>
                <TableCell>{rule.game_event}</TableCell>
                <TableCell>{rule.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

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
            {renderTable(section)}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ScoringRulesDialog;