import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Paper, Box, Button } from "@mui/material";
import ResetIcon from "@mui/icons-material/Restore";

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

export default function Standings({ standings }) {
  const classes = useStyles();
  const [muiTableKey, setMuiTableKey] = useState(1);
  const navigate = useNavigate();

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
    </Paper>
  );
}
