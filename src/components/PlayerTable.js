import React, { useState } from "react";
import { useDrag } from "react-dnd";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Link
} from "@mui/material";
import PlayerProfile from "./PlayerProfile";


const PlayerTable = ({ filteredPlayers, handleSort, handleAddPlayer }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const ItemTypes = {
    PLAYER: "player",
  };

  const PlayerRow = ({ player }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.PLAYER,
      item: { player },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    const textStyle = player.isGrayedOut ? { color: "#d3d3d3" } : {};
    
    const handleNameClick = (player) => {
      setSelectedPlayer(player);
      setDialogOpen(true);
    };

    return (
      <TableRow ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <TableCell>
          <Link
            component="button"
            onClick={() => handleNameClick(player)}
            style={{ ...textStyle, textDecoration: "none" }}
          >
            {player.name}
          </Link>
        </TableCell>
        <TableCell style={textStyle}>{player.position}</TableCell>
        <TableCell style={textStyle}>{player.team}</TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddPlayer(player)}
            disabled={player.isGrayedOut}
          >
            Add
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
    <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSort("name")}>
              <b>Name</b>
            </TableCell>
            <TableCell onClick={() => handleSort("position")}>
              <b>Position</b>
            </TableCell>
            <TableCell onClick={() => handleSort("team")}>
              <b>Team</b>
            </TableCell>
            <TableCell>
              <b>Action</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPlayers.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
        </TableBody>
      </Table>
    
    </TableContainer>
          {selectedPlayer && (
            <PlayerProfile
              playerData={selectedPlayer}
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
            />
          )}
        </>
  );
};

export default PlayerTable;
