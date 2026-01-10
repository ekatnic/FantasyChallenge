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
  "CHI",
  "CAR",
  "SF",
  "NE",
  "PHI",
  "GB",
  "SEA",
  "LAC",
  "DEN",
  "HOU",
  "JAX",
  "PIT",
  "BUF",
]

// NOTE: Update this to update the SurvivorStandings component to show eliminated players as red in table
export const isPlayoffTeamAlive = {
  LAR: true,
  CHI: true,
  CAR: true,
  SF: true,
  NE: true,
  PHI: true,
  GB: true,
  SEA: true,
  LAC: true,
  DEN: true,
  HOU: true,
  JAX: true,
  BAL: true,
  PIT: true,
  BUF: true,
}
