import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useLocation } from "react-router-dom";
import { getStandings } from "../services/api"; // Make sure to import your API function
import { makeStyles } from "@mui/styles";
import { Paper, Typography } from "@mui/material";

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

export default function Standings() {
  const classes = useStyles();
  const [standings, setStandings] = useState([]);
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
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Entry Standings
      </Typography>
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