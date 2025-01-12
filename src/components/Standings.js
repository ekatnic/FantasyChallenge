import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useLocation } from "react-router-dom";
import { getStandings } from "../services/api";
import { makeStyles } from "@mui/styles";
import { Paper, Box, Button } from "@mui/material";
import ResetIcon from "@mui/icons-material/Restore";

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

export default function Standings() {
  const classes = useStyles();
  const [muiTableKey, setMuiTableKey] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const rosteredPlayer = queryParams.get('rostered_player');
  const scaledFlex = queryParams.get('scaled_flex');

  // sets up react query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['standings', rosteredPlayer, scaledFlex],
    queryFn: () => getStandings({ 
      rostered_player: rosteredPlayer, 
      scaled_flex: scaledFlex 
    }),
    select: (data) => data.entries, // get just the entries
    staleTime: 5 * 60 * 1000, //data is fresh for 5mins 
    cacheTime: 30 * 60 * 1000, // keeps unused data cached for 3 mins 
  });

  const resetFilters = () => {
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
        rows={data || []}
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