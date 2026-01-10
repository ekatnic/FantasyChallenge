import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { getStandings, deleteEntry } from "../services/api";
import { useNavigate } from "react-router-dom";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import Pageview from "@mui/icons-material/Pageview";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  evenRow: {
    backgroundColor: "#f5f5f5", // Light gray color for even rows
  },
  oddRow: {
    backgroundColor: "#ffffff", // White color for odd rows
  },
});

const MyEntries = () => {
  const classes = useStyles();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getStandings({ mine_only: true });
        setEntries(data.entries);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-entry/${id}`);
  };

    const handleView = (id) => {
      navigate(`/view-entry/${id}`);
    };

  const handleDelete = async () => {
    try {
      await deleteEntry(selectedEntry.id);
      setEntries(entries.filter((entry) => entry.id !== selectedEntry.id));
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  const handleClickOpen = (entry) => {
    setSelectedEntry(entry);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEntry(null);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
      <Box>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Entries
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Entry Name</strong></TableCell>
                <TableCell><strong>Standings Rank</strong></TableCell>
                <TableCell><strong>Wild Card Score</strong></TableCell>
                <TableCell><strong>Divisional Score</strong></TableCell>
                <TableCell><strong>Conference Score</strong></TableCell>
                <TableCell><strong>Super Bowl Score</strong></TableCell>
                <TableCell><strong>Total Score</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {entries.map((entry, index) => (
                <TableRow key={entry.id} className={index % 2 === 0 ? classes.evenRow : classes.oddRow}>
                  <TableCell>
                    <Button
                      onClick={() => navigate(`/view-entry/${entry.id}`)}
                      sx={{ textTransform: "none" }}
                    >
                      {entry.name}
                    </Button>
                  </TableCell>
                  <TableCell>{entry.rank}</TableCell>
                  <TableCell>{entry.WC}</TableCell>
                  <TableCell>{entry.DIV}</TableCell>
                  <TableCell>{entry.CONF}</TableCell>
                  <TableCell>{entry.SB}</TableCell>
                  <TableCell>{entry.total}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(entry.id)}>
                      <Pageview />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => navigate("/dashboard")}>
            Return Home
          </Button>
        </Box>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete entry {selectedEntry?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyEntries;