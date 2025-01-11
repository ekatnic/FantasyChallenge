// Standings.js
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useLocation } from "react-router-dom";
import { getStandings } from "../services/api"; // Make sure to import your API function
import { makeStyles } from "@mui/styles";
import { Paper, Typography,  Box,  IconButton,  Button} from "@mui/material";
import ResetIcon from "@mui/icons-material/Restore"; // Import the Reset Icon
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
  resetButtonContainer: {
    position: "relative", // Position the reset button container absolutely
    top: 0,
    right: 0,
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
});

export default function Standings() {
  const classes = useStyles();

  const [standings, setStandings] = useState([]);
  const [muiTableKey, setMuiTableKey] = useState(1); // updating key will force reset/rerender of filter on DataGrid 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const rosteredPlayer = queryParams.get('rostered_player');
        const scaledFlex = queryParams.get('scaled_flex');
        const data = await getStandings({ rostered_player: rosteredPlayer, scaled_flex: scaledFlex });
        setStandings(data.entries);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchStandings();
  }, [location.search]);
  
  // Increment key on DataGrid component to force a rerender 
  // https://stackoverflow.com/questions/72810599/how-to-clear-all-applied-filters-in-mui-react-datagrid
  const resetFilters = async () => {
    setMuiTableKey(muiTableKey + 1); 
  };

  const columns = [
    { field: "rank", headerName: "Rank", width: 100 },
    {
      field: "name",
      headerName: "Entry Name",
      width: 200,
      renderCell: (params) => (
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate(`/view-entry/${params.row.id}`)}
        >
          {params.value}
        </span>
      ),
    },
    { field: "WC", headerName: "Wild Card", width: 150 },
    { field: "DIV", headerName: "Divisional", width: 150 },
    { field: "CONF", headerName: "Conference", width: 150 },
    { field: "SB", headerName: "Super Bowl", width: 150 },
    { field: "total", headerName: "Total", width: 150 },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Paper sx={{ p: 4, mt: 4, position : "relative" }}>
      {/* Reset Button */}
      <Box className={classes.resetButtonContainer}>
        <Button
            onClick={resetFilters}
            
            endIcon={<ResetIcon />}
            variant="contained"
        >
          Reset
        </Button>
      </Box>
      <DataGrid
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
          params.indexRelativeToCurrentPage % 2 === 0 ? classes.evenRow : classes.oddRow
        }
      />
    </Paper>
  );
}


// // SurvivorStandings.js
// import React, { useState, useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { useNavigate, useLocation } from "react-router-dom";
// import { makeStyles } from "@mui/styles";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   CircularProgress,
//   Tab
// } from '@mui/material';
// import { getSurivorStandings } from "../services/api";
// import { rosterPositions, isPlayoffTeamAlive } from "../constants";

// const useStyles = makeStyles({
//   dataGrid: {
//     "& .MuiDataGrid-cell": {
//       fontSize: "1rem", // Adjust the font size for the cells
//     },
//     "& .MuiDataGrid-columnHeaders": {
//       fontSize: "1rem", // Adjust the font size for the column headers
//     },
//   },
//   evenRow: {
//     backgroundColor: "#f5f5f5", // Light gray color for even rows
//   },
//   oddRow: {
//     backgroundColor: "#ffffff", // White color for odd rows
//   },
// });

// export default function SurvivorStandings() {
//     const classes = useStyles();
    
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await getSurivorStandings();
//                 console.log("SurvivorStandings.js: fetchData: response:", response)
//                 setData(response);
//                 setLoading(false);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [location.search]);

//     const getPlayerCell = (players, position) => {
//         const player = players.find((p) => p.rostered_position === position);
//         if (!player) return "-";
    
//         const isTeamAlive = isPlayoffTeamAlive[player.team] ?? false;
//         return (
//           <Box
//             sx={{
//               height: "100%",
//               width: "100%",
//               backgroundColor: !isTeamAlive ? "error.main" : "transparent",
//               borderRadius: 1,
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               overflow: "hidden",
//               p: 0.5,
//               boxSizing: "border-box",
//             }}
//           >
//             <Typography
//               variant="body2"
//               noWrap
//               sx={{
//                 color: !isTeamAlive ? "white" : "text.primary",
//                 fontSize: "0.75rem",
//                 lineHeight: 1.1,
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {player.player_name}
//             </Typography>
//             <Typography
//               variant="caption"
//               noWrap
//               sx={{
//                 color: !isTeamAlive ? "white" : "text.secondary",
//                 fontSize: "0.65rem",
//                 lineHeight: 1.1,
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {player.team} • {player.total_points} pts
//             </Typography>
//           </Box>
//         );
//     };
    
//     // generate the rosterPosition column definitions
//     const positionColumns = rosterPositions.map((position) => ({
//         field: position,
//         headerName: position,
//         // width: 150,
//         flex: 1, 
//         minWidth: 100, 
//         renderCell: (params) => getPlayerCell(params.row.players, position),
//     }));
    
//     const columns = [
//         { field: "rank", headerName: "Rank", flex: 0.5, minWidth: 80 },
//         {
//         field: "entry",
//         headerName: "Entry Name",
//         flex: 1.5, 
//         minWidth: 150,
//         renderCell: (params) => (
//             <span
//             style={{ cursor: "pointer", color: "blue" }}
//             onClick={() => navigate(`/view-entry/${params.row.id}`)}
//             >
//             {params.value}
//             </span>
//         ),
//         },
//         { field: "total_points", headerName: "Total", flex: 1, minWidth: 100 },
//         ...positionColumns, // Spread the position columns here, defined above and ordered by rosterPositions
//     ];
  
//     const getRowClassName = (params) => {
//         const isTeamAlive = isPlayoffTeamAlive[params.row.team] ?? false;
//         return isTeamAlive ? classes.redRow : "";
//     };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <Paper sx={{ p: 4, mt: 4 }}>
//       <Typography variant="h4" component="h2" gutterBottom>
//         Remaing lineup Standings
//       </Typography>
//       <DataGrid
//         rows={data}
//         columns={columns}
//         pageSize={10}
//         className={classes.dataGrid}
//         initialState={{
//           sorting: {
//             sortModel: [{ field: 'total', sort: 'desc' }],
//           },
//         }}
//         getRowClassName={(params) =>
//           params.indexRelativeToCurrentPage % 2 === 0 ? classes.evenRow : classes.oddRow
//         }
//       />
//     </Paper>
//   );
// }
