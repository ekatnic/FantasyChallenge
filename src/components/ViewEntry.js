import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { getEntryRoster } from "../services/api";
import { rosterPositions } from "../constants";
import PlayerWeeklyStats from "./PlayerWeeklyStats"; 

const ViewEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null); // State for selected player
  const [statsDialogOpen, setStatsDialogOpen] = useState(false); // State for dialog open

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const data = await getEntryRoster(id);
        setEntry(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const handlePlayerClick = (playerId) => {
    setSelectedPlayerId(playerId);
    setStatsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedPlayerId(null);
    setStatsDialogOpen(false);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  const getPlayerData = (position) => {
    const player = entry.player_list.find(p => p.player.roster_position === position);
    return player ? player : { player: { player_name: "---" }, score: { WC: 0.0, DIV: 0.0, CONF: 0.0, SB: 0.0, total: 0.0 } };
  };

  return (
    <Box>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {entry.entry_name}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Position</strong></TableCell>
                <TableCell><strong>Player Name</strong></TableCell>
                <TableCell><strong>WC</strong></TableCell>
                <TableCell><strong>DIV</strong></TableCell>
                <TableCell><strong>CONF</strong></TableCell>
                <TableCell><strong>SB</strong></TableCell>
                <TableCell><strong>Total</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rosterPositions.map((position) => {
                const { player, score } = getPlayerData(position);
                return (
                  <TableRow key={position}>
                    <TableCell>
                      {position} {position.includes("Scaled Flex") && (
                        (() => {
                          const multiplier = score.sf_multiplier.toString();
                          const colorMap = {
                            "0.75": "red",
                            "1": "black",
                            "1.25": "lightgreen",
                            "1.5": "mediumseagreen",
                            "2": "green",
                            "3": "darkgreen"
                          };
                          return (
                            <span style={{ color: colorMap[multiplier] }}>
                              <b>({multiplier}x)</b>
                            </span>
                          );
                        })()
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handlePlayerClick(player.player_id)}
                      >
                        {player.player_name}
                      </span>
                    </TableCell>
                    <TableCell>{score.WC}</TableCell>
                    <TableCell>{score.DIV}</TableCell>
                    <TableCell>{score.CONF}</TableCell>
                    <TableCell>{score.SB}</TableCell>
                    <TableCell>{score.total}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell></TableCell>
                <TableCell><strong>{entry.entry_scores.WC}</strong></TableCell>
                <TableCell><strong>{entry.entry_scores.DIV}</strong></TableCell>
                <TableCell><strong>{entry.entry_scores.CONF}</strong></TableCell>
                <TableCell><strong>{entry.entry_scores.SB}</strong></TableCell>
                <TableCell><strong>{entry.entry_scores.total}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => navigate("/my-entries")}>
            Return to Entries
          </Button>
        </Box>
      </Paper>

      <PlayerWeeklyStats
        playerId={selectedPlayerId}
        open={statsDialogOpen}
        onClose={handleDialogClose}
      />
    </Box>
  );
};

export default ViewEntry;