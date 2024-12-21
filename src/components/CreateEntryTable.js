import React, { useState, useEffect } from "react";
import {
  Box,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button
} from "@mui/material";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getPlayers, postEntry } from "../services/api";
import NavBar from './NavBar';
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
  const [filterPosition, setFilterPosition] = useState('All');
  const [filterTeam, setFilterTeam] = useState('All');
  const [sortConfig, setSortConfig] = useState([
    { key: 'position', direction: 'ascending' },
    { key: 'team', direction: 'ascending' },
    { key: 'name', direction: 'ascending' }
  ]);
  const [teamError, setTeamError] = useState(null);
  const [rosterName, setRosterName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const rosterPositions = [
    'QB', 'RB1', 'RB2', 'WR1', 'WR2', 'TE', 'Flex1', 'Flex2', 'Flex3', 'Flex4', 'Scaled Flex', 'DEF', 'K'
  ];

  const positionOrder = {
    'QB': 1,
    'RB': 2,
    'WR': 3,
    'TE': 4,
    'DEF': 5
  };

  const rbPositions = ['rb1', 'rb2', 'flex1', 'flex2', 'flex3', 'flex4', 'scaled flex'];
  const wrPositions = ['wr1', 'wr2', 'flex1', 'flex2', 'flex3', 'flex4', 'scaled flex'];
  const tePositions = ['te', 'flex1', 'flex2', 'flex3', 'flex4', 'scaled flex'];

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

  const handleAddPlayer = (player) => {
    const position = player.position;
    const playerTeam = player.team;

    // Check if the team of the player being added is already in the roster
    const teamAlreadyInRoster = Object.values(formData).some(playerId => {
      const existingPlayer = allPlayers.find(p => p.id === playerId);
      return existingPlayer && existingPlayer.team === playerTeam;
    });

    if (teamAlreadyInRoster) {
      setTeamError(`You cannot have more than one player from the same team (${playerTeam}) in your roster.`);
      return;
    }

    let positionToAdd = null;

    if (position === 'QB' || position === 'DEF' || position === 'K') {
      positionToAdd = position.toLowerCase();
    } else if (position === 'RB') {
      positionToAdd = rbPositions.find(pos => !formData[pos]) || 'scaled flex';
    } else if (position === 'WR') {
      positionToAdd = wrPositions.find(pos => !formData[pos]) || 'scaled flex';
    } else if (position === 'TE') {
      positionToAdd = tePositions.find(pos => !formData[pos]) || 'scaled flex';
    }

    if (positionToAdd) {
      setFormData((prev) => ({
        ...prev,
        [positionToAdd]: player.id,
      }));
    }

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
    setSortConfig((prevSortConfig) => {
      const existingSort = prevSortConfig.find(sort => sort.key === key);
      if (existingSort) {
        const newDirection = existingSort.direction === 'ascending' ? 'descending' : 'ascending';
        return prevSortConfig.map(sort => sort.key === key ? { ...sort, direction: newDirection } : sort);
      } else {
        return [...prevSortConfig, { key, direction: 'ascending' }];
      }
    });
  };

  const sortedPlayers = [...players].sort((a, b) => {
    for (const { key, direction } of sortConfig) {
      if (key === 'position') {
        const orderA = positionOrder[a.position] || 99;
        const orderB = positionOrder[b.position] || 99;
        if (orderA < orderB) return direction === 'ascending' ? -1 : 1;
        if (orderA > orderB) return direction === 'ascending' ? 1 : -1;
      } else {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredPlayers = sortedPlayers.map(player => {
    const teamAlreadyInRoster = Object.values(formData).some(playerId => {
      const existingPlayer = allPlayers.find(p => p.id === playerId);
      return existingPlayer && existingPlayer.team === player.team;
    });

    let isGrayedOut = teamAlreadyInRoster;

    if (!isGrayedOut) {
      if (player.position === 'QB' && formData.qb) {
        isGrayedOut = true;
      } else if (player.position === 'DEF' && formData.def) {
        isGrayedOut = true;
      } else if (player.position === 'K' && formData.k) {
        isGrayedOut = true;
      } else if (player.position === 'RB') {
        isGrayedOut = rbPositions.every(pos => formData[pos]);
      } else if (player.position === 'WR') {
        isGrayedOut = wrPositions.every(pos => formData[pos]);
      } else if (player.position === 'TE') {
        isGrayedOut = tePositions.every(pos => formData[pos]);
      }
    }

    return {
      ...player,
      isGrayedOut
    };
  }).filter(player => {
    return (filterPosition === 'All' || 
            (filterPosition === 'Flex' && ['RB', 'WR', 'TE'].includes(player.position)) ||
            player.position === filterPosition) &&
           (filterTeam === 'All' || player.team === filterTeam) &&
           (player.name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const uniqueTeams = [...new Set(players.map(player => player.team))];

  const isRosterFull = rosterPositions.every(position => formData[position.toLowerCase()]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <Container maxWidth="xl">
        <NavBar />
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
              <Box sx={{ mt: 14 }}>
                <AvailableTeams uniqueTeams={uniqueTeams} formData={formData} allPlayers={allPlayers} />
              </Box>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title="Scaled FLEX Rules"
                    titleTypographyProps={{ variant: "h6" }}
                  />
                  <CardContent>
                    <Typography variant="body2">
                      <strong>Scaled FLEX Points:</strong>
                      <ul>
                        <li>50%+ ownership: No multiplier</li>
                        <li>25-50%: 1.2x multiplier</li>
                        <li>12.5-25%: 1.3x multiplier</li>
                        <li>5-12.5%: 1.5x multiplier</li>
                        <li>0-5%: 1.75x multiplier</li>
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
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
                  <MenuItem value="Flex">Flex</MenuItem>
                  <MenuItem value="DEF">Defense / Special Teams</MenuItem>
                  <MenuItem value="K">Kicker</MenuItem>
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
              <TextField
                fullWidth
                label="Search Player by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                margin="normal"
              />
              <PlayerTable filteredPlayers={filteredPlayers} handleAddPlayer={handleAddPlayer} handleSort={handleSort} />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ mt: 4 }}>
                <TextField
                  fullWidth
                  label="Roster Name"
                  value={rosterName}
                  onChange={(e) => setRosterName(e.target.value)}
                  margin="normal"
                />
                <Roster rosterPositions={rosterPositions} formData={formData} allPlayers={allPlayers} handleRemovePlayer={handleRemovePlayer} handleAddPlayer={handleAddPlayer} />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={!isRosterFull}
                >
                  Submit Entry
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </DndProvider>
  );
};

export default CreateEntryTable;