import React from 'react';
import { useDrag } from 'react-dnd';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PlayerTable = ({ filteredPlayers, handleSort }) => {
  const ItemTypes = {
    PLAYER: 'player',
  };

  const PlayerRow = ({ player }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.PLAYER,
      item: { player },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    return (
      <TableRow ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <TableCell>{player.name}</TableCell>
        <TableCell>{player.position}</TableCell>
        <TableCell>{player.team}</TableCell>
      </TableRow>
    );
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSort('name')}><b>Name</b></TableCell>
            <TableCell onClick={() => handleSort('position')}><b>Position</b></TableCell>
            <TableCell onClick={() => handleSort('team')}><b>Team</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPlayers.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayerTable;