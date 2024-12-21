import React, { useState, useEffect } from "react";
import {
  Box,
  Alert,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { getPlayers, postEntry } from "../services/api";
import Navbar from './Navbar';
import AvailableTeams from './AvailableTeams';
import PlayerTable from './PlayerTable';
import Roster from './Roster';

const CreateEntryTable = () => {
  const [formData, setFormData] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [filterPosition, setFilterPosition] = useState('All');
  const [filterTeam, setFilterTeam] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [teamError, setTeamError] = useState(null);

  const rosterPositions = [
    'QB', 'RB1', 'RB2', 'WR1', 'WR2', 'TE', 'Flex1', 'Flex2', 'Flex3', 'Flex4', 'Scaled Flex', 'DEF'
  ];

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayers();
        setPlayers(data);
        setAllPlayers(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const data = await postEntry(formData);
      console.log('Entry created successfully:', data);
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      setSubmissionError('Error creating entry. Please try again.');
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update selected players and teams
    setSelectedPlayers((prev) => {
      const newSelectedPlayers = { ...prev };
      const previousPlayerId = formData[field];
      if (previousPlayerId) {
        delete newSelectedPlayers[previousPlayerId];
      }
      if (value) {
        newSelectedPlayers[value] = allPlayers.find(player => player.id === value);
      }
      return newSelectedPlayers;
    });
  };

  const handleAddPlayer = (player) => {
    // Check if the team of the player being added is already in the roster
    const playerTeam = player.team;
    const teamAlreadyInRoster = Object.values(formData).some(playerId => {
      const existingPlayer = allPlayers.find(p => p.id === playerId);
      return existingPlayer && existingPlayer.team === playerTeam;
    });

    if (teamAlreadyInRoster) {
      setTeamError(`You cannot have more than one player from the same team (${playerTeam}) in your roster.`);
      return;
    }

    setFormData((prev) => {
      const newFormData = { ...prev };
      if (player.position === 'RB') {
        if (!newFormData['rb1']) {
          newFormData['rb1'] = player.id;
        } else {
          newFormData['rb2'] = player.id;
        }
      } else if (player.position === 'WR') {
        if (!newFormData['wr1']) {
          newFormData['wr1'] = player.id;
        } else {
          newFormData['wr2'] = player.id;
        }
      } else {
        newFormData[player.position.toLowerCase()] = player.id;
      }
      return newFormData;
    });

    // Clear any previous team error
    setTeamError(null);
  };

  const handleRemovePlayer = (position) => {
    setFormData((prev) => {
      const newFormData = { ...prev };
      delete newFormData[position.toLowerCase()];
      return newFormData;
    });

    // Clear any previous team error
    setTeamError(null);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredPlayers = sortedPlayers.filter(player => {
    return (filterPosition === 'All' || player.position === filterPosition) &&
           (filterTeam === 'All' || player.team === filterTeam);
  });

  const uniqueTeams = [...new Set(players.map(player => player.team))];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container maxWidth="lg">
      <Navbar />
      <Box sx={{ my: 4 }}>
        {submissionError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submissionError}
          </Alert>
        )}
        {teamError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {teamError}
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ mt: 4 }}>
              <AvailableTeams uniqueTeams={uniqueTeams} formData={formData} allPlayers={allPlayers} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
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
                <MenuItem value="DEF">Defense</MenuItem>
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
                  <MenuItem key={team} value={team}>{team}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <PlayerTable filteredPlayers={filteredPlayers} handleAddPlayer={handleAddPlayer} handleSort={handleSort} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ mt: 4 }}>
              <Roster rosterPositions={rosterPositions} formData={formData} allPlayers={allPlayers} handleRemovePlayer={handleRemovePlayer} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CreateEntryTable;