import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getPlayerWeeklyStats } from "../services/api";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Avatar } from "@mui/material";

export default function PlayerWeeklyStats({ playerId, open, onClose }) {
  const [player, setPlayer] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerWeeklyStats = async () => {
      try {
        const data = await getPlayerWeeklyStats(playerId);
        setPlayer(data.player);
        setWeeklyStats(data.weekly_stats);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    if (open) {
      fetchPlayerWeeklyStats();
    }
  }, [playerId, open]);

  const columns = [
    { field: "week", headerName: "Week", width: 100 },
    { field: "week_score", headerName: "Week Score", width: 150 },
    { field: "passing_yards", headerName: "Passing Yards", width: 150 },
    { field: "passing_tds", headerName: "Passing TDs", width: 150 },
    { field: "passing_interceptions", headerName: "Interceptions", width: 150 },
    { field: "rushing_yards", headerName: "Rushing Yards", width: 150 },
    { field: "rushing_tds", headerName: "Rushing TDs", width: 150 },
    { field: "receptions", headerName: "Receptions", width: 150 },
    { field: "receiving_yards", headerName: "Receiving Yards", width: 150 },
    { field: "receiving_tds", headerName: "Receiving TDs", width: 150 },
    { field: "fumbles_lost", headerName: "Fumbles Lost", width: 150 },
    { field: "sacks", headerName: "Sacks", width: 150 },
    { field: "interceptions", headerName: "Interceptions", width: 150 },
    { field: "fumbles_recovered", headerName: "Fumbles Recovered", width: 150 },
    { field: "safeties", headerName: "Safeties", width: 150 },
    { field: "defensive_tds", headerName: "Defensive TDs", width: 150 },
    { field: "return_tds", headerName: "Return TDs", width: 150 },
    { field: "points_allowed", headerName: "Points Allowed", width: 150 },
    { field: "two_pt_conversions", headerName: "2-pt Conversions", width: 150 },
    { field: "blocked_kicks", headerName: "Blocked Kicks", width: 150 },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Player Weekly Stats</DialogTitle>
      <DialogContent>
        {player && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={player.info.image} alt={player.name} sx={{ width: 100, height: 100, mr: 2 }} />
            <Box>
              <Typography variant="h5">{player.name}</Typography>
              <Typography variant="subtitle1">{player.position} - {player.team}</Typography>
              <Typography variant="body2">Height: {player.info.height}</Typography>
              <Typography variant="body2">Weight: {player.info.weight}</Typography>
              <Typography variant="body2">School: {player.info.school}</Typography>
            </Box>
          </Box>
        )}
        <DataGrid
          rows={weeklyStats}
          columns={columns}
          pageSize={10}
          autoHeight
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}