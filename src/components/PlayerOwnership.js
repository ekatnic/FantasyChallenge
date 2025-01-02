import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { getPlayerOwnership } from "../services/api"; // Make sure to import your API function
import { makeStyles } from "@mui/styles";
import { Paper, Typography, TextField, Box } from "@mui/material";
import PlayerWeeklyStats from "./PlayerWeeklyStats";

const useStyles = makeStyles({
  dataGrid: {
    "& .MuiDataGrid-cell": {
      fontSize: "1rem", // Adjust the font size for the cells
    },
    "& .MuiDataGrid-columnHeaders": {
      fontSize: "1rem", // Adjust the font size for the column headers
    },
  },
  evenRow: {
    backgroundColor: "#f5f5f5", // Light gray color for even rows
  },
  oddRow: {
    backgroundColor: "#ffffff", // White color for odd rows
  },
});

export default function PlayerOwnership() {
  const classes = useStyles();
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayerOwnership = async () => {
      try {
        const data = await getPlayerOwnership();
        setPlayers(data.players_scoring_dict);
        setFilteredPlayers(data.players_scoring_dict);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchPlayerOwnership();
  }, []);

  useEffect(() => {
    const filtered = players.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlayers(filtered);
  }, [searchTerm, players]);

  const handleOpen = (playerId) => {
    setSelectedPlayerId(playerId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlayerId(null);
  };

  const columns = [
    { field: "name", headerName: "Player", width: 200 },
    { field: "team", headerName: "Team", width: 100 },
    { field: "position", headerName: "Position", width: 100 },
    {
      field: "roster_percentage",
      headerName: "Roster %",
      width: 150,
      renderCell: (params) => (
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate(`/standings?rostered_player=${params.row.id}`)}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "scaled_flex_percentage",
      headerName: "Scaled Flex %",
      width: 150,
      renderCell: (params) => (
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate(`/standings?scaled_flex=${params.row.id}`)}
        >
          {params.value}
        </span>
      ),
    },
    { field: "scaled_flex_multiplier", headerName: "SF Multiplier", width: 150 },
    {
      field: "total",
      headerName: "Total Points",
      width: 150,
      renderCell: (params) => (
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => handleOpen(params.row.id)}
        >
          {params.value}
        </span>
      ),
    },
    { field: "WC", headerName: "Wild Card", width: 150 },
    { field: "DIV", headerName: "Divisional", width: 150 },
    { field: "CONF", headerName: "Conference", width: 150 },
    { field: "SB", headerName: "Super Bowl", width: 150 },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Player Ownership
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search Players"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <DataGrid
        rows={filteredPlayers}
        columns={columns}
        pageSize={10}
        className={classes.dataGrid}
        initialState={{
          sorting: {
            sortModel: [{ field: 'roster_percentage', sort: 'desc' }],
          },
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? classes.evenRow : classes.oddRow
        }
      />
      {selectedPlayerId && (
        <PlayerWeeklyStats
          playerId={selectedPlayerId}
          open={open}
          onClose={handleClose}
        />
      )}
    </Paper>
  );
}