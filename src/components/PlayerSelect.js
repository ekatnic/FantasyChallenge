import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const PlayerSelect = ({ label, field, position, players, formData, handleChange, errors, selectedPlayers }) => {
  // Filter players by position and exclude already selected players
  const options = players.filter(player => {
    if (position === 'FLEX') {
      return (player.position === 'RB' || player.position === 'WR' || player.position === 'TE') && !selectedPlayers[player.id];
    }
    return player.position === position && !selectedPlayers[player.id];
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