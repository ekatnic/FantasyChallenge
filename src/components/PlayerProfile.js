import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Tabs,
  Tab,
  Paper,
  Box,
  Avatar,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
const BASE_URL = process.env.REACT_APP_API_BASE_URL || ""; // can remove when we replace home
export const TEST_PLAYERS_DATA = [
  {
    id: 5983,
    info: {
      id: 5819,
      birthdate: "2002-02-14",
      height: "6'0\"",
      weight: "197",
      school: "Ohio State",
      image: "https://a.espncdn.com/i/headshots/nfl/players/full/4430878.png",
      player: 5983,
    },
    stats: [
      {
        id: 8801,
        season: 2024,
        season_type: "pre_season",
        rushing_yards_avg: 0.0,
        rushing_yards: 0,
        carries: 0,
        long_rush: 0,
        rushing_tds: 0,
        receptions: 4,
        receiving_tds: 0,
        long_rec: 25,
        targets: 4,
        receiving_yards: 45,
        receiving_yards_avg: 11.25,
        pass_attempts: 0,
        passing_tds: 0,
        passing_yards: 0,
        interceptions: 0,
        pass_completions: 0,
        passing_yards_avg: 0.0,
        qbr: 0.0,
        sacked: 0,
        rating: 0.0,
        fumbles: 0,
        fumbles_lost: 0,
        fumbles_recovered: 0,
        player: 5983,
      },
      {
        id: 8802,
        season: 2024,
        season_type: "regular_season",
        rushing_yards_avg: 1.375,
        rushing_yards: 22,
        carries: 4,
        long_rush: 8,
        rushing_tds: 0,
        receptions: 96,
        receiving_tds: 6,
        long_rec: 46,
        targets: 132,
        receiving_yards: 1121,
        receiving_yards_avg: 11.68125,
        pass_attempts: 1,
        passing_tds: 0,
        passing_yards: 35,
        interceptions: 0,
        pass_completions: 1,
        passing_yards_avg: 2.1875,
        qbr: 6.25,
        sacked: 0,
        rating: 7.425000000000001,
        fumbles: 1,
        fumbles_lost: 0,
        fumbles_recovered: 1,
        player: 5983,
      },
    ],
    name: "Jaxon Smith-Njigba",
    position: "WR",
    team: "SEA",
  },
  {
    id: 5984,
    info: {
      id: 5820,
      birthdate: "1992-03-24",
      height: "6'2\"",
      weight: "258",
      school: "Southern Illinois",
      image: "https://a.espncdn.com/i/headshots/nfl/players/full/2508256.png",
      player: 5984,
    },
    stats: [
      {
        id: 8803,
        season: 2024,
        season_type: "pre_season",
        rushing_yards_avg: 0.0,
        rushing_yards: 0,
        carries: 0,
        long_rush: 0,
        rushing_tds: 0,
        receptions: 2,
        receiving_tds: 0,
        long_rec: 22,
        targets: 2,
        receiving_yards: 30,
        receiving_yards_avg: 15.0,
        pass_attempts: 0,
        passing_tds: 0,
        passing_yards: 0,
        interceptions: 0,
        pass_completions: 0,
        passing_yards_avg: 0.0,
        qbr: 0.0,
        sacked: 0,
        rating: 0.0,
        fumbles: 0,
        fumbles_lost: 0,
        fumbles_recovered: 0,
        player: 5984,
      },
      {
        id: 8804,
        season: 2024,
        season_type: "regular_season",
        rushing_yards_avg: 0.0,
        rushing_yards: 0,
        carries: 0,
        long_rush: 0,
        rushing_tds: 0,
        receptions: 6,
        receiving_tds: 1,
        long_rec: 18,
        targets: 10,
        receiving_yards: 40,
        receiving_yards_avg: 2.6818181818181817,
        pass_attempts: 0,
        passing_tds: 0,
        passing_yards: 0,
        interceptions: 0,
        pass_completions: 0,
        passing_yards_avg: 0.0,
        qbr: 0.0,
        sacked: 0,
        rating: 0.0,
        fumbles: 0,
        fumbles_lost: 0,
        fumbles_recovered: 0,
        player: 5984,
      },
    ],
    name: "MyCole Pruitt",
    position: "TE",
    team: "PIT",
  },
  {
    "id": 5986,
    "info": {
        "id": 5822,
        "birthdate": "2002-05-02",
        "height": "5'9\"",
        "weight": "195",
        "school": "Monmouth",
        "image": "https://a.espncdn.com/i/headshots/nfl/players/full/4775270.png",
        "player": 5986
    },
    "stats": [
        {
            "id": 8806,
            "season": 2024,
            "season_type": "pre_season",
            "rushing_yards_avg": 2.85,
            "rushing_yards": 47,
            "carries": 17,
            "long_rush": 9,
            "rushing_tds": 0,
            "receptions": 3,
            "receiving_tds": 0,
            "long_rec": 28,
            "targets": 3,
            "receiving_yards": 42,
            "receiving_yards_avg": 13.0,
            "pass_attempts": 0,
            "passing_tds": 0,
            "passing_yards": 0,
            "interceptions": 0,
            "pass_completions": 0,
            "passing_yards_avg": 0.0,
            "qbr": 0.0,
            "sacked": 0,
            "rating": 0.0,
            "fumbles": 0,
            "fumbles_lost": 0,
            "fumbles_recovered": 0,
            "player": 5986
        }
    ],
    "name": "Jaden Shirden",
    "position": "RB",
    "team": "CAR"
},
{
    "id": 5987,
    "info": {
        "id": 5823,
        "birthdate": "2000-10-20",
        "height": "5'9\"",
        "weight": "211",
        "school": "Michigan State",
        "image": "https://a.espncdn.com/i/headshots/nfl/players/full/4567048.png",
        "player": 5987
    },
    "stats": [
        {
            "id": 8807,
            "season": 2024,
            "season_type": "regular_season",
            "rushing_yards_avg": 3.7272727272727275,
            "rushing_yards": 573,
            "carries": 153,
            "long_rush": 28,
            "rushing_tds": 7,
            "receptions": 46,
            "receiving_tds": 1,
            "long_rec": 21,
            "targets": 53,
            "receiving_yards": 299,
            "receiving_yards_avg": 6.409090909090909,
            "pass_attempts": 0,
            "passing_tds": 0,
            "passing_yards": 0,
            "interceptions": 0,
            "pass_completions": 0,
            "passing_yards_avg": 0.0,
            "qbr": 0.0,
            "sacked": 0,
            "rating": 0.0,
            "fumbles": 1,
            "fumbles_lost": 0,
            "fumbles_recovered": 3,
            "player": 5987
        }
    ],
    "name": "Kenneth Walker III",
    "position": "RB",
    "team": "SEA"
}
];

const PlayerProfile = () => {
  const player = TEST_PLAYERS_DATA[3];
  const position = player.position;
  console.log("player", player)
  console.log("position", position)
  const regularSeasonStats = player.stats.find(
  stat => stat.season_type === "regular_season"
  );

const InfoItem = ({ label, value }) => (
  <Box sx={{ mb: 1 }}>
    <Typography color="text.secondary" variant="body2">{label}</Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

const StatsTable = ({ title, stats }) => (
  <TableContainer component={Paper} sx={{ mb: 2 }}>
    <Typography variant="h6" sx={{ p: 2 }}>{title}</Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Season</TableCell>
          {Object.keys(stats).map(stat => (
            <TableCell key={stat} align="right">{stat}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{regularSeasonStats.season}</TableCell>
          {Object.values(stats).map((value, index) => (
            <TableCell key={index} align="right">{value}</TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);
   // Puts stats in order based on position (i.e. rushing stats first for RBs, receiving stats first for WRs, etc.)
  function getStatsOrderedForPosition(stats, position) {

      const rushingStats = {
        'Rushing Yards': stats.rushing_yards,
        'Carries': stats.carries,
        'TDs': stats.rushing_tds
      };
      
      const receivingStats = {
        'Receptions': stats.receptions,
        'Targets': stats.targets,
        'Receiving Yards': stats.receiving_yards,
        'TDs': stats.receiving_tds
      };
      
      const passingStats = {
        'Passing Yards': stats.passing_yards,
        'Completions': stats.pass_completions,
        'Attempts': stats.pass_attempts,
        'TDs': stats.passing_tds,
        'Int': stats.interceptions,
        'QBR': stats.qbr.toFixed(1),
        'Rating': stats.rating.toFixed(1),
      };
    
    if (position === "RB") {
      return {"Rushing" : rushingStats, "Receiving" : receivingStats, "Passing" : passingStats}
    } else if (position === "WR" || position === "TE") {
      return {"Receiving" : receivingStats, "Rushing" : rushingStats, "Passing" : passingStats}
    } else if (position === "QB") {
      return {"Passing" : passingStats, "Rushing" : rushingStats, "Receiving" : receivingStats};
    } else {
      return {"Rushing" : rushingStats, "Receiving" : receivingStats, "Passing" : passingStats};
    }
  }

  let statsList = getStatsOrderedForPosition(regularSeasonStats, player.position);
  
  return (
    <>
      <Card sx={{ p: 3 }}> 
        <CardHeader
          avatar={<Avatar src={player.info.image} />}
          title={player.name}
          subheader={`${player.position} - ${player.team}`}
        />

        {statsList && Object.keys(statsList).map((key, index) => (
          <StatsTable key={index} title={key + " Stats"} stats={statsList[key]} />
        ))
        }
    </Card>
    </>
      
  )
}; 
export default PlayerProfile;
