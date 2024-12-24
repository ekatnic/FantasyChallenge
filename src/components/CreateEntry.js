import React, { useState, useEffect } from "react";
import {
  Box,
  Alert,
  Container,
  Grid,
  TextField,
  Button
} from "@mui/material";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getPlayers, postEntry } from "../services/api";
import NavBar from './NavBar';
import AvailableTeams from './AvailableTeams';
import Roster from './Roster';
import ScaledFlexRules from './ScaledFlexRules';
import PlayerFilterAndTable from './PlayerFilterAndTable';
import {rosterPositions, positionOrder, rbPositions, wrPositions, tePositions} from '../constants'

const CreateEntry = () => {
  const [formData, setFormData] = useState({});
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
                <ScaledFlexRules />
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <PlayerFilterAndTable
                filterPosition={filterPosition}
                setFilterPosition={setFilterPosition}
                filterTeam={filterTeam}
                setFilterTeam={setFilterTeam}
                uniqueTeams={uniqueTeams}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredPlayers={filteredPlayers}
                handleAddPlayer={handleAddPlayer}
                handleSort={handleSort}
              />
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

export default CreateEntry;