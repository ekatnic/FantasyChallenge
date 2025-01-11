import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import PlayerTable from "./PlayerTable";

const PlayerFilterAndTable = ({
  filterPosition,
  setFilterPosition,
  filterTeam,
  setFilterTeam,
  uniqueTeams,
  searchTerm,
  setSearchTerm,
  filteredPlayers,
  handleAddPlayer,
  handleSort,
}) => {
  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="filter-position-label">Filter by Position</InputLabel>
        <Select
          labelId="filter-position-label"
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
          label="Filter by Position"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="QB">Quarterback</MenuItem>
          <MenuItem value="RB">Running Back</MenuItem>
          <MenuItem value="WR">Wide Receiver</MenuItem>
          <MenuItem value="TE">Tight End</MenuItem>
          <MenuItem value="Flex">Flex</MenuItem>
          <MenuItem value="DEF">Defense / Special Teams</MenuItem>
          <MenuItem value="K">Kicker</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="filter-team-label">Filter by Team</InputLabel>
        <Select
          labelId="filter-team-label"
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          label="Filter by Team"
        >
          <MenuItem value="All">All</MenuItem>
          {uniqueTeams.map((team) => (
            <MenuItem key={team} value={team}>
              {team}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Search Player by Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
      />
      <Tooltip title="Drag players to Your Roster or click Add"
        arrow
        sx={{
          fontSize: '3rem',  
          padding: '15px',    
          maxWidth: 400,      
        }}
      >
        <span>
          <PlayerTable
            filteredPlayers={filteredPlayers}
            handleAddPlayer={handleAddPlayer}
            handleSort={handleSort}
          />
        </span>
      </Tooltip>
    </>
  );
};

export default PlayerFilterAndTable;
