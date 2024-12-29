import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import { getEntry } from "../services/api";

const ViewEntry = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const data = await getEntry(id);
        setEntry(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Box>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {entry.name}
        </Typography>
        <List>
          {entry.rostered_players.map((player) => (
            <ListItem key={player.id}>
              <ListItemText primary={`Position: ${player.roster_position}, Player ID: ${player.player_id}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ViewEntry;