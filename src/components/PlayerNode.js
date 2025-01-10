import React from 'react';

const PlayerNode = ({ playerData, isAlive = true, isFuture = false, isComplete = false, size = 100 }) => {
  const player = playerData?.player;
  const info = playerData?.player_info;

    // isComplete and isAlive == green 
    // isComplete and !isAlive == red
    // !isComplete and !isFuture and isAlive == green
    // !isComplete and !isFuture and !isAlive == red
    // isFuture == clear

    // let bgColor = isFuture ? 'transparent' : isComplete ? isAlive ? '#22c55e' : '#ef4444' : isAlive ? '#22c55e' : '#ef4444';
    let bgColor = ''; 
    if (isFuture) {
        bgColor = 'transparent';
    } else if (isComplete && isAlive) {
        bgColor = '#22c55e'
    } else if (isComplete && !isAlive) {
        bgColor = '#ef4444';
    } else {
        bgColor = isAlive ? '#22c55e' : '#ef4444';
    }
    
    
    
  const styles = {
    container: {
      position: 'relative',
      width: `${size}px`,
      height: `${size}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    node: {
        width: `${size}px`,
        height: `${size}px`,
    //   width: '100px',
    //   height: '100px',
      borderRadius: '50%',
      backgroundColor: bgColor,
      border: isFuture
        ? '2px dashed #cbd5e1' // Dashed outline for future nodes
        : '2px solid white', // Solid outline for complete or active nodes
    //   display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isFuture ? '#cbd5e1' : 'white', // Muted text color for future nodes
      fontSize: `${size / 5}px`,
      boxShadow: isFuture ? 'none' : '0 2px 4px rgba(0,0,0,0.1)', // No shadow for future nodes
      textAlign: 'center',
      overflow: 'hidden',
      flexDirection: 'column',
      padding: '10px',
    },
    playerImage: {
      // width: '50%',
      width : 'auto',
      height: '75%',
      borderRadius: '50%',
      marginBottom: '8px',
      objectFit: 'cover',
      opacity: isFuture ? 0.5 : 1, // Dimmed for future nodes
    },
    playerName: {
      fontSize: `${size / 8}px`,
      fontWeight: 'bold',
      margin: 0,
    },
    playerPosition: {
      fontSize: `${size / 10}px`,
      margin: 0,
    },
  };

  
  return (
    <div style={styles.container}>
      <div style={styles.node}>
        {info?.image && !isFuture ? (
          <img src={info.image} alt={player?.player_name} style={styles.playerImage} />
        ) : (
          <div style={styles.playerImage} />
        )}
        {/* <p style={styles.playerName}>
          {!isFuture ? player?.player_name : ''}
        </p> */}
        {/* <p style={styles.playerPosition}>
          {!isFuture ? player?.roster_position : ''}
        </p> */}
      </div>
    </div>
  );
};

export default PlayerNode;


// import React from 'react';

// const PlayerNode = ({ playerData, isAlive = true, isFuture = false, isComplete = false, size = 100 }) => {
//   const player = playerData?.player;
//   const info = playerData?.player_info;

//   const styles = {
//     container: {
//       position: 'relative',
//       width: `${size}px`,
//       height: `${size}px`,
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     node: {
//       width: '100%',
//       height: '100%',
//       borderRadius: '50%',
//       backgroundColor: isFuture
//         ? 'transparent' // Clear color for future nodes
//         : isComplete
//         ? isAlive
//           ? '#22c55e' // Green for completed and alive
//           : '#ef4444' // Red for completed and dead
//         : isAlive
//         ? '#22c55e' // Green for alive (default)
//         : '#ef4444', // Red for dead (default)
//       border: isFuture
//         ? '2px dashed #cbd5e1' // Dashed outline for future nodes
//         : '2px solid white', // Solid outline for complete or active nodes
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       color: isFuture ? '#cbd5e1' : 'white', // Muted text color for future nodes
//       fontSize: `${size / 5}px`,
//       boxShadow: isFuture ? 'none' : '0 2px 4px rgba(0,0,0,0.1)', // No shadow for future nodes
//       textAlign: 'center',
//       overflow: 'hidden',
//       flexDirection: 'column',
//       padding: '10px',
//     },
//     playerImage: {
//       width: '50%',
//       height: '50%',
//       borderRadius: '50%',
//       marginBottom: '8px',
//       objectFit: 'cover',
//       opacity: isFuture ? 0.5 : 1, // Dimmed for future nodes
//     },
//     playerName: {
//       fontSize: `${size / 8}px`,
//       fontWeight: 'bold',
//       margin: 0,
//     },
//     playerPosition: {
//       fontSize: `${size / 10}px`,
//       margin: 0,
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.node}>
//         {info?.image && !isFuture ? (
//           <img src={info.image} alt={player?.player_name} style={styles.playerImage} />
//         ) : (
//           <div style={styles.playerImage} />
//         )}
//         <p style={styles.playerName}>
//           {!isFuture ? player?.player_name : ''}
//         </p>
//         <p style={styles.playerPosition}>
//           {!isFuture ? player?.roster_position : ''}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PlayerNode;