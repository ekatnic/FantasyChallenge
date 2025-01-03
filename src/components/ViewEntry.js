import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { getEntryRoster, deleteEntry } from "../services/api";
import { rosterPositions } from "../constants";

const ViewEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

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

  const handleDelete = async () => {
    try {
      await deleteEntry(id);
      navigate("/my-entries");
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
                    <TableCell>{position}</TableCell>
                    <TableCell>{player.player_name}</TableCell>
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
          <Button variant="contained" color="secondary" onClick={() => navigate(`/edit-entry/${id}`)}>
            Edit Entry
          </Button>
          <Button variant="contained" color="error" onClick={handleClickOpen}>
            Delete Entry
          </Button>
        </Box>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this entry?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewEntry;