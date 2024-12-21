import React from 'react';
import { Card, CardContent, CardHeader, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Roster = ({ rosterPositions, formData, allPlayers, handleRemovePlayer }) => {
  return (
    <Card>
      <CardHeader
        title="Your Roster"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <List>
          {rosterPositions.map((position) => {
            const playerId = formData[position.toLowerCase()];
            const player = allPlayers.find(p => p.id === playerId);
            return (
              <ListItem key={position} secondaryAction={
                player && (
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemovePlayer(position)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }>
                <ListItemText primary={`${position}: ${player ? player.name : '---'}`} />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

export default Roster;