import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useLocation } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material';
import ResetIcon from "@mui/icons-material/Restore";
import { getSurivorStandings } from "../services/api";
import { rosterPositions, isPlayoffTeamAlive } from "../constants";

const useStyles = makeStyles({
  dataGrid: {
    "& .MuiDataGrid-cell": {
      fontSize: "1rem",
    },
    "& .MuiDataGrid-columnHeaders": {
      fontSize: "1rem",
    },
  },
  evenRow: {
    backgroundColor: "#f5f5f5",
  },
  oddRow: {
    backgroundColor: "#ffffff",
  },
  userRow: {
    backgroundColor: "lightblue !important",
    "&:hover": {
      backgroundColor: "lightblue !important",
    },
  },
  resetButtonContainer: {
    position: "relative",
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

export default function SurvivorStandings() {
  const classes = useStyles();
  const [muiTableKey, setMuiTableKey] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const rosteredPlayer = queryParams.get('rostered_player');
  const scaledFlex = queryParams.get('scaled_flex');

  // sets up react query
  const { data: standings, isLoading, isError, error } = useQuery({
    queryKey: ['survivor-standings', rosteredPlayer, scaledFlex],
    queryFn: () => getSurivorStandings({
      rostered_player: rosteredPlayer,
      scaled_flex: scaledFlex
    }),
    select: (data) => data.entries,
    staleTime: 5 * 60 * 1000, //data is fresh for 5mins 
    cacheTime: 30 * 60 * 1000, // keeps unused data cached for 3 mins 
  });

  const resetFilters = () => {
    setMuiTableKey(muiTableKey + 1);
  };

  const getPlayerCell = (players, position) => {
    const player = players.find((p) => p.rostered_position === position);
    if (!player) return "-";

    const isTeamAlive = isPlayoffTeamAlive[player.team] ?? false;

    const firstName = player.player_name.split(" ")[0];
    const lastName = player.player_name.split(" ")[1];
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
        <Typography
          variant="body2"
          noWrap
          sx={{
            color: !isTeamAlive ? "white" : "text.primary",
            fontSize: "0.75rem",
            lineHeight: 1.1,
            textOverflow: "ellipsis",
          }}
        >
          {shortName}
        </Typography>
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
    minWidth: 100,
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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

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
        rows={standings || []}
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
            : (params.indexRelativeToCurrentPage % 2 === 0 ? classes.evenRow : classes.oddRow)
        }
      />
    </Paper>
  );
}