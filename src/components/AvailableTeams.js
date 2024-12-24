import React from 'react';
import { Card, CardContent, CardHeader, Grid, ListItem, ListItemText, Divider } from '@mui/material';

const AvailableTeams = ({ uniqueTeams, roster, allPlayers }) => {
  return (
    <Card>
      <CardHeader
        title="Available Teams"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Grid container spacing={2}>
          {uniqueTeams.map((team, index) => {
            const teamInRoster = Object.values(roster).some(playerId => {
              const player = allPlayers.find(p => p.id === playerId);
              return player && player.team === team;
            });
            return (
              <Grid item xs={6} key={index}>
                <ListItem>
                  <ListItemText
                    primary={team}
                    slotProps={{
                      primary: {
                        style: {
                          color: teamInRoster ? 'red' : 'green'
                        }
                      }
                    }}
                  />
                </ListItem>
                <Divider />
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AvailableTeams;