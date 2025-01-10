import {React, useState} from 'react';
import { Dialog, Card, CardContent, CardHeader, Avatar, Typography, Box, Table, 
  TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Tab, Tabs
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export function PlayerProfile({playerData, open, onClose}) {
  console.log("playerData", playerData)
  const { name, position, team, info, stats } = playerData;
  const [seasonType, setSeasonType] = useState('regular_season');

  // TODO: we can drop this if we want, mainly did it so we could have post season tab if we wanted
  const filteredStats = stats.filter(stat => stat.season_type === seasonType);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // TODO: Add case for "K" and "DEF", will need to create pretty different table setups for those stats
  const getStatsOrder = (position) => {
    switch (position) {
      case 'RB':
        return ['Rushing', 'Receiving', 'Passing'];
      case 'WR':
      case 'TE':
        return ['Receiving', 'Rushing', 'Passing'];
      case 'K':
        return ['Kicking']
      case 'DEF':
          return ['Defense']
      default:
        return ['Passing', 'Rushing', 'Receiving'];
    }
  };

  const StatTable = ({ type, filteredStats }) => {
    const tableConfig = {
      'Receiving': {
        title: 'Receiving Stats',
        headers: ['Season', 'Receptions', 'Targets', 'Yards', 'Avg', 'TDs', 'Long', 'FPTS'],
        cells: (season) => [
          season.season,
          season.receptions,
          season.targets,
          season.receiving_yards,
          season.receiving_yards_avg.toFixed(1),
          season.receiving_tds,
          season.long_rec,
          season.half_ppr
        ]
      },
      'Rushing': {
        title: 'Rushing Stats',
        headers: ['Season', 'Carries', 'Yards', 'Avg', 'TDs', 'Long', 'FPTS'],
        cells: (season) => [
          season.season,
          season.carries,
          season.rushing_yards,
          season.rushing_yards_avg.toFixed(1),
          season.rushing_tds,
          season.long_rush,
          season.half_ppr
        ]
      },
      'Passing': {
        title: 'Passing Stats',
        headers: ['Season', 'Comp', 'Att', 'Yards', 'TDs', 'Int', 'Rating', 'FPTS'],
        cells: (season) => [
          season.season,
          season.pass_completions,
          season.pass_attempts,
          season.passing_yards,
          season.passing_tds,
          season.interceptions,
          season.rating.toFixed(1),
          season.half_ppr
        ]
      },
      'Kicking': {
        title: 'Kicking Stats',
        headers: ['Season', 'FG', 'XP', 'FPTS'],
        cells: (season) => [
          season.season,
          `${season.fg_made}/${season.fg_attempts}`,
          `${season.xp_made}/${season.xp_attempts}`,
          season.half_ppr
        ]
      },
      'Defense': {
        title: 'Defensive Stats',
        headers: ['Season', 'Yards / game', 'PA / game'],
        cells: (season) => [
          season.season,
          season.total_yards_allowed_per_game.toFixed(1),
          season.pts_allowed_per_game.toFixed(1)
        ]
      }
    };

    const config = tableConfig[type];

    return (
      <Paper sx={{
        marginTop: '20px',
        marginBottom: '20px'
      }}>
        <Typography variant="h6" sx={{ padding: '16px' }}>{config.title}</Typography>
        <Table>
          <TableHead>
            <TableRow>
              {config.headers.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStats.map((season, index) => (
              <TableRow key={`${type}-${season.season}-${index}`}>
                {config.cells(season).map((cell, index) => (
                  <TableCell key={index}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh', overflowY: 'auto', position: 'relative' }
      }}
    >
      <IconButton onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'grey.500',
          zIndex: 1
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box sx={{ padding: '20px' }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <Avatar src={info.image} alt={name} sx={{ width: 100, height: 100 }} />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="h4">{name}</Typography>
                    <Typography variant="h6" color="text.secondary">
                      {position} - {team}
                    </Typography>
                  </div>
                  {position !== "DEF" && (
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography>Height: {info.height}</Typography>
                      <Typography>Weight: {info.weight} lbs</Typography>
                      <Typography>Born: {formatDate(info.birthdate)}</Typography>
                      <Typography>School: {info.school}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
          <Tabs 
            value={seasonType} 
            onChange={(_, newValue) => setSeasonType(newValue)}
          >
            <Tab label="Regular Season" value="regular_season" />
            {/* <Tab label="Preseason" value="pre_season" /> */}
            <Tab label="Postseason" value="post_season" />
          </Tabs>
        </Box>
        {getStatsOrder(position).map((statType) => (
          <StatTable key={statType} type={statType} filteredStats={filteredStats} />
        ))}
      </Box>
    </Dialog>
  );
};

export default PlayerProfile;