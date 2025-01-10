import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { getEntryRosterProfiles, deleteEntry } from "../services/api";
import { rosterPositions, alivePlayoffTeams, currentRound } from "../constants";

import PlayerNode from './PlayerNode';
const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px'
  },
  roundLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 64px',
    marginBottom: '32px',
    marginLeft: '120px'
  },
  roundLabel: {
    fontSize: '18px',
    fontWeight: '600'
  },
  rowsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    position: 'relative',
    // marginBottom: '24px'
  },
  positionLabel: {
    width: '120px',
    fontSize: '14px',
    fontWeight: '600',
    marginRight: '16px'
  },
  nodesContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    position: 'relative'
  },
  nodeContainer: {
    position: 'relative',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center'
  },
  connection: {
    position: 'absolute',
    top: '50%',
    left: '16px',
    height: '2px',
    backgroundColor: '#CBD5E0',
    transform: 'translateY(-50%)',
    zIndex: 0
  },
  connectionContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0
  },
  node: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    position: 'relative',
    zIndex: 1,
    cursor: 'pointer'
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    zIndex: 2,
    marginBottom: '8px'
  }
};

const EntryNodeGraph = () => {
  const [hoveredNode, setHoveredNode] = React.useState(null);

  const entryPlayers =  [
        {
            "player": {
                "id": 49,
                "player_id": 3,
                "player_name": "Lamar Jackson",
                "roster_position": "QB",
                "team": "BAL"
            },
            "player_info": {
                "id": 3,
                "birthdate": "1997-01-07",
                "height": "6'2\"",
                "weight": "205",
                "school": "Louisville",
                "image": "https://a.espncdn.com/i/headshots/nfl/players/full/3916387.png",
                "player": 3
            }
        },
        {
            "player": {
                "id": 50,
                "player_id": 16,
                "player_name": "James Cook",
                "roster_position": "RB1",
                "team": "BUF"
            },
            "player_info": {
                "id": 16,
                "birthdate": "1999-09-25",
                "height": "5'11\"",
                "weight": "190",
                "school": "Georgia",
                "image": "https://a.espncdn.com/i/headshots/nfl/players/full/4379399.png",
                "player": 16
            }
        },
        {
            "player": {
                "id": 51,
                "player_id": 30,
                "player_name": "Audric Estime",
                "roster_position": "RB2",
                "team": "DEN"
            },
            "player_info": {
                "id": 30,
                "birthdate": "2003-09-06",
                "height": "5'11\"",
                "weight": "227",
                "school": "Notre Dame",
                "image": "https://a.espncdn.com/i/headshots/nfl/players/full/4569682.png",
                "player": 30
            }
        },
        {
            "player": {
                "id": 52,
                "player_id": 42,
                "player_name": "Jahmyr Gibbs",
                "roster_position": "Flex1",
                "team": "DET"
            },
            "player_info": {
                "id": 42,
                "birthdate": "2002-03-20",
                "height": "5'9\"",
                "weight": "200",
                "school": "Alabama",
                "image": "https://a.espncdn.com/i/headshots/nfl/players/full/4429795.png",
                "player": 42
            }
        },
        {
            "player": {
                "id": 53,
                "player_id": 66,
                "player_name": "Dameon Pierce",
                "roster_position": "Flex2",
                "team": "HOU"
            },
            "player_info": {
                "id": 66,
                "birthdate": "2000-02-19",
                "height": "5'10\"",
                "weight": "215",
                "school": "Florida",
                "image": "https://a.espncdn.com/i/headshots/nfl/players/full/4360238.png",
                "player": 66
            }
        },
        {
            "player": {
                "id": 54,
                "player_id": 93,
                "player_name": "J.K. Dobbins",
                "roster_position": "Scaled Flex1",
                "team": "LAC"
            },
            "player_info": {
                "id": 93,
                "birthdate": "1998-12-17",
                "height": "5'10\"",
                "weight": "215",
                "school": "Ohio State",
                "image": "https://a.espncdn.com/i/headshots/nfl/players/full/4241985.png",
                "player": 93
            }
        },
        {
            "player": {
                "id": 55,
                "player_id": 120,
                "player_name": "Cam Akers",
                "roster_position": "Scaled Flex2",
                "team": "MIN"
            },
            "player_info": {
                "id": 120,
                "birthdate": "1999-06-22",
                "height": "5'10\"",
                "weight": "217",
                "school": "Florida State",
                "image": "https://a.espncdn.com/i/headshots/nfl/players/full/4240021.png",
                "player": 120
            }
        },
        {
            "player": {
                "id": 56,
                "player_id": 74,
                "player_name": "Kansas City Chiefs",
                "roster_position": "DEF",
                "team": "KC"
            },
            "player_info": {
                "id": 74,
                "birthdate": "1920-09-17",
                "height": "",
                "weight": "0",
                "school": "",
                "image": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/kc.png",
                "player": 74
            }
        },
        {
            "player": {
                "id": 57,
                "player_id": 49,
                "player_name": "Brandon McManus",
                "roster_position": "K",
                "team": "GB"
            },
            "player_info": {
                "id": 49,
                "birthdate": "1991-07-25",
                "height": "6'3\"",
                "weight": "201",
                "school": "Temple",
                "image": "https://a.espncdn.com/i/headshots/nfl/players/full/16339.png",
                "player": 49
            }
        },
        {
            "player": {
                "id": 58,
                "player_id": 114,
                "player_name": "Demarcus Robinson",
                "roster_position": "WR1",
                "team": "LAR"
            },
            "player_info": {
                "id": 114,
                "birthdate": "1994-09-21",
                "height": "6'1\"",
                "weight": "202",
                "school": "Florida",
                "image": "https://a.espncdn.com/i/headshots/nfl/players/full/3043116.png",
                "player": 114
            }
        },
        {
            "player": {
                "id": 59,
                "player_id": 149,
                "player_name": "George Pickens",
                "roster_position": "WR2",
                "team": "PIT"
            },
            "player_info": {
                "id": 149,
                "birthdate": "2001-03-04",
                "height": "6'3\"",
                "weight": "200",
                "school": "Georgia",
                "image": "https://a.espncdn.com/i/headshots/nfl/players/full/4426354.png",
                "player": 149
            }
        },
        {
            "player": {
                "id": 60,
                "player_id": 160,
                "player_name": "Cade Otton",
                "roster_position": "TE",
                "team": "TB"
            },
            "player_info": {
                "id": 160,
                "birthdate": "1999-04-15",
                "height": "6'5\"",
                "weight": "247",
                "school": "Washington",
                "image": "https://a.espncdn.com/i/headshots/nfl/players/full/4243331.png",
                "player": 160
            }
        }
    ]
  console.log("entryPlayers", entryPlayers)
  // length of entryPlayers 
  console.log("entryPlayers.length", entryPlayers.length)
  const rounds = ['Round 1', 'Round 2', 'Round 3', 'Round 4'];

  const getPlayerForPosition = (position) => {
    return entryPlayers.find(player => player.player.roster_position === position);
  };

  const NodeConnection = () => (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    >
      <line
        x1="16"
        y1="16"
        x2="100%"
        y2="16"
        stroke="#CBD5E0"
        strokeWidth="2"
      />
    </svg>
  );
  
  return (
    <div style={styles.container}>
      <div style={styles.roundLabels}>
        {rounds.map((round) => (
          <div key={round} style={styles.roundLabel}>
            {round}
          </div>
        ))}
      </div>
      <div style={styles.rowsContainer}>
        {rosterPositions.map((position) => (
          <div key={position} style={styles.row}>
            <div style={styles.positionLabel}>{position}</div>
            <div style={styles.nodesContainer}>
              <NodeConnection />
              {Array.from({ length: 4 }, (_, index) => {
                        const playerObj = getPlayerForPosition(position);
                        const player = playerObj?.player;
                        const playerInfo = playerObj?.player_info;

                        console.log("player", player);
                        console.log("playerInfo", playerInfo);

                        const isAlive = player ? alivePlayoffTeams[player.team] : false;
                        console.log("isAlive", isAlive);
                    // Check for the 3 states: isComplete, current, future
                    return index < currentRound ? (
                      
                      // isComplete state: index < 2
                      <div key={index} style={styles.nodeContainer}>
                        
                        <PlayerNode playerData={null} isAlive={isAlive} isComplete={true} size={75} />
                      </div>
                    ) : index === currentRound ? (
                      // current state: index === 2
                      (() => {
                        const playerObj = getPlayerForPosition(position);
                        const player = playerObj?.player;
                        const playerInfo = playerObj?.player_info;

                        console.log("player", player);
                        console.log("playerInfo", playerInfo);

                        const isAlive = player ? alivePlayoffTeams[player.team] : false;
                        console.log("isAlive", isAlive);

                        return (
                          <div
                            key={index}
                            style={styles.nodeContainer}
                            onMouseEnter={() => setHoveredNode(`${position}-${index}`)}
                            onMouseLeave={() => setHoveredNode(null)}
                          >
                            <PlayerNode
                              playerData={playerObj}
                              isAlive={isAlive}
                              isComplete={false} // current node is not complete
                              size={75}
                            />
                          </div>
                        );
                      })()
                    ) : (
                    // future state: index > 2
                    <div key={index} style={styles.nodeContainer}>
                      <PlayerNode playerData={null} isAlive={false} isFuture={true} size={75} />
                    </div>
                  );
                })}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntryNodeGraph;


// import React, { useState } from "react";

// const EntryNodeGraph = () => {
//   const [hoveredNode, setHoveredNode] = useState(null);

//   const entryPlayers = [
//     {
//       player: {
//         id: 49,
//         player_id: 3,
//         player_name: "Lamar Jackson",
//         roster_position: "QB",
//         team: "BAL",
//       },
//       player_info: {
//         id: 3,
//         birthdate: "1997-01-07",
//         height: "6'2\"",
//         weight: "205",
//         school: "Louisville",
//         image: "https://a.espncdn.com/i/headshots/nfl/players/full/3916387.png",
//         player: 3,
//       },
//     },
//     // Other players here...
//   ];

//   return (
//     <div style={styles.container}>
//       <div style={styles.rowsContainer}>
//         {entryPlayers.map((entry, index) => {
//           const player = entry?.player; // Safely access player property
//           const playerInfo = entry?.player_info; // Safely access player_info

//           if (!player || !playerInfo) {
//             // Skip rendering if player or player_info is missing
//             return null;
//           }

//           return (
//             <div key={index} style={styles.row}>
//               <div style={styles.positionLabel}>{player.roster_position}</div>
//               <div style={styles.nodesContainer}>
//                 <div
//                   style={styles.node}
//                   onMouseEnter={() => setHoveredNode(player.id)}
//                   onMouseLeave={() => setHoveredNode(null)}
//                 >
//                   {player.player_name}
//                 </div>
//                 {hoveredNode === player.id && (
//                   <div style={styles.tooltip}>{playerInfo.school}</div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default EntryNodeGraph;
