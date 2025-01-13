import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Paper, Typography, Box, Button, Tooltip } from '@mui/material';
import ResetIcon from "@mui/icons-material/Restore";
import { rosterPositions, isPlayoffTeamAlive } from "../constants";
import PlayerWeeklyStats from "./PlayerWeeklyStats";

const useStyles = makeStyles({
  dataGrid: {
    // TODO: mobile friendly data grid for root container
    "& .MuiDataGrid-root": {
      minWidth: "320px", // Set the minimum width to 100%
    },

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
  userRow: {
    backgroundColor: "lightblue !important", // Light blue color for user rows
    "&:hover": {
      backgroundColor: "lightblue !important", // Maintain light blue on hover
    },
  },
  resetButtonContainer: {
    position: "relative", // Position the reset button container absolutely
    top: 0,
    right: 0,
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
});

export default function SurvivorStandings({ standings }) {
  const classes = useStyles();
  const [muiTableKey, setMuiTableKey] = useState(1);
  const navigate = useNavigate();
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);

  const resetFilters = () => {
    setMuiTableKey(muiTableKey + 1);
  };

  const handlePlayerClick = (playerId) => {
    setSelectedPlayerId(playerId);
    setStatsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedPlayerId(null);
    setStatsDialogOpen(false);
  };

  const getPlayerCell = (players, position) => {
    const player = players.find((p) => p.rostered_position === position);
    if (!player) return "-";

    const isTeamAlive = isPlayoffTeamAlive[player.team] ?? false;

    const firstName = player.player_name.split(" ")[0];
    const lastName  = player.player_name.split(" ")[1];
    const shortName = firstName.charAt(0) + ". " + lastName;
  
    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          backgroundColor: !isTeamAlive ? "error.main" : "transparent",
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          p: 0.5,
          boxSizing: "border-box",
        }}
      >
        <Tooltip title="Click to view player stats">
          <Typography
            variant="body2"
            noWrap
            sx={{
              color: !isTeamAlive ? "white" : "text.primary",
              fontSize: "0.75rem",
              lineHeight: 1.1,
              textOverflow: "ellipsis",
              cursor: "pointer",
              textDecoration: "none", // No underline by default
              "&:hover": {
                textDecoration: "underline", // Underline on hover
              },
            }}
            onClick={() => handlePlayerClick(player.player_id)} // Add onClick handler
          >
            {shortName}
          </Typography>
        </Tooltip>
        <Typography
          variant="caption"
          noWrap
          sx={{
            color: !isTeamAlive ? "white" : "text.secondary",
            fontSize: "0.65rem",
            lineHeight: 1.1,
            textOverflow: "ellipsis",
          }}
        >
          {player.team} • {player.total_points} pts
        </Typography>
      </Box>
    );
  };
  const positionColumns = rosterPositions.map((position) => ({
    field: position,
    headerName: position,
    flex: 1,
    // minWidth: "100%",
    minWidth : 85,
    sortable : false,
    renderCell: (params) => getPlayerCell(params.row.players, position),
  }));

  const columns = [
    { field: "rank", headerName: "Rank", flex: 0.5, minWidth: 80 },
    {
      field: "name",
      headerName: "Entry Name",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => (
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate(`/view-entry/${params.row.id}`)}
        >
          {params.value}
        </span>
      ),
    },
    { field: "total", headerName: "Total", flex: 1, minWidth: 80 },
    ...positionColumns,
  ];

  return (
    <Paper sx={{ p: 4, mt: 4, position: "relative" }}>
      <Box className={classes.resetButtonContainer}>
        <Button
          onClick={resetFilters}
          endIcon={<ResetIcon />}
          variant="contained"
        >
          Reset Table
        </Button>
      </Box>
      <DataGrid
        key={muiTableKey}
        rows={standings}
        columns={columns}
        pageSize={10}
        className={classes.dataGrid}
        initialState={{
          sorting: {
            sortModel: [{ field: 'total', sort: 'desc' }],
          },
        }}
        getRowClassName={(params) =>
          params.row.is_user_entry
            ? classes.userRow
            : params.indexRelativeToCurrentPage % 2 === 0
            ? classes.evenRow
            : classes.oddRow
        }
      />
      <PlayerWeeklyStats
        playerId={selectedPlayerId}
        open={statsDialogOpen}
        onClose={handleDialogClose}
      />
    </Paper>
  );
}