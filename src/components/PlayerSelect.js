import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const PlayerSelect = ({ label, field, position, players,  remainingTeams, formData, handleChange, errors, selectedPlayers }) => {
  const options = players.filter(player => {
    const isFlexPosition = position === 'FLEX' && (player.position === 'RB' || player.position === 'WR' || player.position === 'TE');
    const isCorrectPosition = player.position === position;
    const isFromValidTeam = remainingTeams.includes(player.team);
    const isNotSelected = !selectedPlayers[player.id];
    return (isFlexPosition || isCorrectPosition) && isFromValidTeam && isNotSelected;
  });

  // Add the currently selected player to the options list
  const selectedPlayer = players.find(player => player.id === formData[field]);
  if (selectedPlayer) {
    options.push(selectedPlayer);
  }

  return (
    <FormControl fullWidth margin="normal" error={!!errors[field]}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={formData[field] || ''}
        onChange={(e) => {
          handleChange(field, e.target.value);
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name} - {option.team}
          </MenuItem>
        ))}
      </Select>
      {errors[field] && (
        <Typography color="error" variant="caption" sx={{ ml: 2 }}>
          {errors[field]}
        </Typography>
      )}
    </FormControl>
  );
};

export default PlayerSelect;