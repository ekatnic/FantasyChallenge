export const BASE_URL = process.env.REACT_APP_API_BASE_URL || ""; // can remove when we replace home

export const rosterPositions = [
  "QB",
  "RB1",
  "RB2",
  "WR1",
  "WR2",
  "TE",
  "Flex1",
  "Flex2",
  "Scaled Flex1",
  "Scaled Flex2",
  "DEF",
  "K",
];

export const positionOrder = {
  QB: 1,
  RB: 2,
  WR: 3,
  TE: 4,
  DEF: 5,
};

export const rbPositions = [
  "RB1",
  "RB2",
  "Flex1",
  "Flex2",
  "Scaled Flex1",
  "Scaled Flex2",
];
export const wrPositions = [
  "WR1",
  "WR2",
  "Flex1",
  "Flex2",
  "Scaled Flex1",
  "Scaled Flex2",
];
export const tePositions = [
  "TE",
  "Flex1",
  "Flex2",
  "Scaled Flex1",
  "Scaled Flex2",
];

// Remove non-playoff teams when final games conclude
export const playoffTeams = [
  "LAR",
  "TB",
  "DET",
  "MIN",
  "GB",
  "PHI",
  "WAS",
  "KC",
  "LAC",
  "DEN",
  "HOU",
  "BAL",
  "PIT",
  "BUF",
]

// NOTE: Update this to update the SurvivorStandings component to show eliminated players as red in table
export const isPlayoffTeamAlive = {
  LAR: true,
  TB: true,
  DET: true,
  MIN: true,
  GB: false,
  PHI: true,
  WAS: true,
  KC: true,
  LAC: false,
  DEN: false,
  HOU: true,
  BAL: true,
  PIT: false,
  BUF: true,
}
