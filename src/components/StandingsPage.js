import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper } from "@mui/material";
import Standings from "./Standings";
import SurvivorStandings from "./SurvivorStandings";

export default function StandingsPage() {
  const [selectedTab, setSelectedTab] = useState(0); // manages the selected tab

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4"
              // center the text
              sx={{
                  textAlign: "center",
                  justifyContent: "center",

              }}
              gutterBottom>
                {{ selectedTab } === 0 ? "Entry Standings" : "Survivor Standings" }
            </Typography>
      <Tabs 
        value={selectedTab} 
        onChange={handleTabChange} 
        variant="fullWidth" 
        sx={{ marginBottom: 2 }}
      >
        <Tab label="Entry Standings" />
        <Tab label="Survivor Standings" />
      </Tabs>

      <Box>
        {selectedTab === 0 ? <Standings /> : <SurvivorStandings />}
      </Box>
    </Paper>
  );
}
