import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const PlayerTable = ({ filteredPlayers, handleAddPlayer, handleSort }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSort('name')}>Name</TableCell>
            <TableCell onClick={() => handleSort('position')}>Position</TableCell>
            <TableCell onClick={() => handleSort('team')}>Team</TableCell>
            <TableCell>Add to Roster</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPlayers.slice(0, 20).map((player) => (
            <TableRow key={player.id}>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.position}</TableCell>
              <TableCell>{player.team}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddPlayer(player)}
                >
                  Add
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayerTable;