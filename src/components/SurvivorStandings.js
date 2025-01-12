import React, { useState, useEffect } from "react";
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

export default function SurvivorStandings() {
  const classes = useStyles();
  
  const [standings, setStandings] = useState([]);
  const [muiTableKey, setMuiTableKey] = useState(1); // updating key will force reset/rerender of filter on DataGrid 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const rosteredPlayer = queryParams.get('rostered_player');
        const scaledFlex = queryParams.get('scaled_flex');
        const response = await getSurivorStandings({ rostered_player: rosteredPlayer, scaled_flex: scaledFlex });
        setStandings(response.entries);
        setLoading(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  // Increment key on DataGrid component to force a rerender 
  // https://stackoverflow.com/questions/72810599/how-to-clear-all-applied-filters-in-mui-react-datagrid
  const resetFilters = async () => {
    setMuiTableKey(muiTableKey + 1); 
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
  
  // generate the rosterPosition column definitions
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
    { field: "total", headerName: "Total", flex: 1, minWidth: 80},
    ...positionColumns, // Spread the position columns here, defined above and ordered by rosterPositions
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Paper sx={{ p: 4, mt: 4, position: "relative"}}>
      {/* Reset Button */}
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
        key={muiTableKey} // Use the muiTableKey to trigger a re-render
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
          params.row.is_user_entry ? classes.userRow : (params.indexRelativeToCurrentPage % 2 === 0 ? classes.evenRow : classes.oddRow)
        }
      />
    </Paper>
  );
}