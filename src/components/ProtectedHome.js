// import React from "react";
// import { Typography, Paper, Box, Button,  Link, Card, CardContent } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add"; // Plus icon
// import ListIcon from "@mui/icons-material/List"; // List icon
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// // export default function ProtectedHome() {
// //   const { user } = useAuth();
// //   const navigate = useNavigate();

// //   return (
// //     <Paper sx={{ p: 4, mt: 4 }}>
// //       <Typography variant="h4" component="h1" gutterBottom>
// //         Welcome to the Playoff Challenge
// //       </Typography>
// //       <Box sx={{ mt: 3, mb: 3 }}>
// //         <Typography variant="body1" gutterBottom>
// //           Create a lineup of 12 players. Once the playoffs start you will not be able to change your lineup. The catch is that you can only select <strong>ONE PLAYER PER TEAM</strong>. $20 to enter the competition. You can submit up to 10 entries (see full rules). 
// //         </Typography>
// //         <Box sx={{ textAlign: "center", mb: 3 }}>
// //           <img
// //             src="https://raw.githubusercontent.com/ekatnic/FantasyChallenge/master/fantasy_football_app/static/images/venmo.PNG"
// //             alt="Venmo QR Code"
// //             className="img-fluid"
// //             style={{ maxWidth: "100%", height: "auto" }}
// //           />
// //         </Box>
// //         <Typography variant="body1" gutterBottom>
// //         Please Venmo @Spenser-Wyatt by kickoff Saturday. Payouts will be determined as a percentage after all entries have been locked. Check out the full rules <a href="/rules">here</a>. Standings will be available after the first game kicks off. Check out <a href="https://twitter.com/ShowdownUpdates">our Twitter</a> for updates on the competition. Any questions please reach out: spenserjwyatt@gmail.com
// //         </Typography>
// //         <Typography variant="body2" color="text.secondary" gutterBottom>
// //           Website developed by Ethan Katnic, Spenser Wyatt, and Angus Watters.
// //         </Typography>
// //       </Box>
// //       <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
// //         <Button variant="contained" color="primary" onClick={() => navigate("/rules")}>
// //           Rules
// //         </Button>
// //         <Button variant="contained" color="primary" onClick={() => navigate("/my-entries")}>
// //           My Entries
// //         </Button>
// //         <Button variant="contained" color="primary" onClick={() => navigate("/create-entry")}>
// //           Create Entry
// //         </Button>
// //       </Box>
// //     </Paper>
// //   );
// // }

// export default function ProtectedHome() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <Paper
//       sx={{
//         p: 4,
//         mt: 4,
//         mx: "auto",
//         maxWidth: 800,
//         textAlign: "center",
//         background: "#f9f9f9",
//       }}
//       elevation={3}
//     >
//       <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
//         Welcome to the Playoff Challenge
//       </Typography>
//       <Card
//         sx={{
//           mt: 4,
//           mb: 2,
//           p: 2,
//           backgroundColor: "#ffffff",
//           borderRadius: 2,
//           boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <Box
//           sx={{
//             textAlign: "center",
//             mb: 3,
//           }}
//         >
//           <img
//             src="https://raw.githubusercontent.com/ekatnic/FantasyChallenge/master/fantasy_football_app/static/images/venmo.PNG"
//             alt="Venmo QR Code"
//             style={{
//               maxWidth: "100%",
//               height: "auto",
//               borderRadius: 8,
//               border: "1px solid #ddd",
//             }}
//           />
//           <Typography
//             variant="caption"
//             display="block"
//             sx={{ mt: 1, color: "#777" }}
//           >
//             Scan to Venmo @Spenser-Wyatt by kickoff Saturday.
//           </Typography>
//         </Box>
//         <CardContent>
//           <Typography variant="body1" gutterBottom sx={{ lineHeight: 1.8 }}>
//             Build a lineup of <strong>12 players</strong>—<strong>one player per team</strong>. No drafts, free agency,
//             or salary cap! Earn bonus points through the <strong>SCALED FLEX</strong> multiplier and watch your players
//             compete in the playoffs.
//           </Typography>
//           <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: "bold" }}>
//             Important Deadlines:
//           </Typography>
//           <Typography variant="body1" gutterBottom>
//             Lineups lock at kickoff of the first playoff game:
//             <strong> 4:30 PM EST, Saturday, Jan 11th</strong>.
//           </Typography>
//           <Typography variant="body1" gutterBottom>
//             <strong>Live Updates:</strong> Scoring, stats, and standings will be updated live throughout the contest.
//           </Typography>
//         </CardContent>
//       </Card>

//       <Typography variant="body2" gutterBottom>
//         This contest is completely free. For a paid contest, visit{" "}
//         <Link href="https://playoff-showdown.com" target="_blank" rel="noopener" sx={{ fontWeight: "bold" }}>
//           playoff-showdown.com
//         </Link>
//       </Typography>

//       <Box sx={{ mt: 4 }}>
//         <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//           Have questions? Contact us at{" "}
//           <Link href="mailto:fantasyfootballshowdown@gmail.com">fantasyfootballshowdown@gmail.com</Link>.
//         </Typography>
//         <Typography variant="subtitle2" color="text.secondary">
//           Want to work with us? Email{" "}
//           <Link href="mailto:fantasyfootballshowdown@gmail.com">fantasyfootballshowdown@gmail.com</Link>.
//         </Typography>
//         <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
//           Developed by Ethan Katnic, Spenser Wyatt, and Angus Watters.
//         </Typography>
//       </Box>

//       <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
//         <Button
//           variant="contained"
//           color="warning"
//           onClick={() => navigate("/rules")}>
//           Rules
//         </Button>
//         <Button
//           variant="contained"
//           color="info"
//           startIcon={<ListIcon />} // Add list icon
//           onClick={() => navigate("/my-entries")}>
//           My Entries
//         </Button>
//         <Button
//           variant="contained"
//           sx={{ bgcolor: "green" }}
//           startIcon={<AddIcon />} // Add plus icon
//           onClick={() => navigate("/create-entry")}>
//           Create Entry
//         </Button>
//       </Box>
//     </Paper>
//   );
// };



// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Typography, Paper, Box, Button, Card, CardContent, Link } from "@mui/material";

import React from "react";
import { Typography, Paper, Box, Button,  Link, Card, CardContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Plus icon
import ListIcon from "@mui/icons-material/List"; // List icon
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Paper
      sx={{
        p: 4,
        mt: 4,
        mx: "auto",
        // maxWidth: 800,
        maxWidth: '75%',
        textAlign: "center",
        background: "#f9f9f9",
      }}
      elevation={3}
    >
      {/* <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
        Playoff Challenge
      </Typography> */}
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
        }}
      >
        Welcome to the Playoff Challenge
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Compete, Watch, Win!
      </Typography>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          color="warning"
          onClick={() => navigate("/rules")}>
          Rules
        </Button>
        <Button
          variant="contained"
          color="info"
          startIcon={<ListIcon />} // Add list icon
          onClick={() => navigate("/my-entries")}>
          My Entries
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "green" }}
          startIcon={<AddIcon />} // Add plus icon
          onClick={() => navigate("/create-entry")}>
          Create Entry
        </Button>
      </Box>
      <Card
        sx={{
          mt: 4,
          mb: 2,
          p: 2,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent>
          <Typography variant="body1" gutterBottom sx={{ lineHeight: 1.8 }}>
            Build a lineup of <strong>12 players</strong>—<strong>one player per team</strong>. No drafts, free agency,
            or salary cap! Earn bonus points through the <strong>SCALED FLEX</strong> multiplier and watch your players
            compete in the playoffs.
          </Typography>
          <Box
          sx={{
            textAlign: "center",
              mb: 3,
            
          }}
        >
          <img
            src="https://raw.githubusercontent.com/ekatnic/FantasyChallenge/master/fantasy_football_app/static/images/venmo.PNG"
            alt="Venmo QR Code"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: 8,
            }}
          />
          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 1, color: "#777" }}
          >
            Scan to Venmo @Spenser-Wyatt by kickoff Saturday.
          </Typography>
        </Box>
          <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: "bold" }}>
            Important Deadlines:
          </Typography>
          <Typography variant="body1" gutterBottom>
            Lineups lock at kickoff of the first playoff game:
            <strong> 4:30 PM EST, Saturday, Jan 11th</strong>.
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Live Updates:</strong> Scoring, stats, and standings will be updated live throughout the contest.
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="body2" gutterBottom>
        Looking for a free content? visit{" "}
        <Link href="https://playoff-showdown-free.com" target="_blank" rel="noopener" sx={{ fontWeight: "bold" }}>
          playoff-showdown-free.com
        </Link>
      </Typography>
      <Box sx={{ mt: 4 }}>
      <Typography>
        Follow us on{" "}
          <Link
            href="https://twitter.com/ShowdownUpdates"
            underline="hover"
            color="primary"
            target="_blank"
            rel="noopener"
          >
            Twitter
          </Link>{" "}
        </Typography>
         <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Have questions? Contact us at{" "}
          <Link href="mailto:fantasyfootballshowdown@gmail.com">fantasyfootballshowdown@gmail.com</Link>.
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Want to work with us? Email{" "}
          <Link href="mailto:fantasyfootballshowdown@gmail.com">fantasyfootballshowdown@gmail.com</Link>.
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
          Developed by Ethan Katnic, Spenser Wyatt, and Angus Watters.
        </Typography>
      </Box>
    </Paper>
  );
};

// export default Home;