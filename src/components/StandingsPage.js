import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Typography, Paper } from "@mui/material";
import Standings from "./Standings";
import SurvivorStandings from "./SurvivorStandings";
import { getStandings, getSurivorStandings } from "../services/api";
import { useLocation } from "react-router-dom";

export default function StandingsPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [regularStandings, setRegularStandings] = useState([]);
  const [survivorStandings, setSurvivorStandings] = useState([]);
  const [regularLoading, setRegularLoading] = useState(true);
  const [survivorLoading, setSurvivorLoading] = useState(true);
  const [regularError, setRegularError] = useState(null);
  const [survivorError, setSurvivorError] = useState(null);
  
  const location = useLocation();

  // fetch regular standings 
  useEffect(() => {
    const fetchRegularStandings = async () => {
      try {
        setRegularLoading(true);
        const queryParams = new URLSearchParams(location.search);
        const rosteredPlayer = queryParams.get('rostered_player');
        const scaledFlex = queryParams.get('scaled_flex');
        
        const regularData = await getStandings({ 
          rostered_player: rosteredPlayer, 
          scaled_flex: scaledFlex 
        });

        setRegularStandings(regularData.entries);
        setRegularError(null);
      } catch (error) {
        setRegularError(error.message);
      } finally {
        setRegularLoading(false);
      }
    };

    fetchRegularStandings();
  }, [location.search]);

  // fetch survivor standings
  useEffect(() => {
    const fetchSurvivorStandings = async () => {
      try {
        setSurvivorLoading(true);
        const queryParams = new URLSearchParams(location.search);
        const rosteredPlayer = queryParams.get('rostered_player');
        const scaledFlex = queryParams.get('scaled_flex');
        
        const survivorData = await getSurivorStandings({ 
          rostered_player: rosteredPlayer, 
          scaled_flex: scaledFlex 
        });

        setSurvivorStandings(survivorData.entries);
        setSurvivorError(null);
      } catch (error) {
        setSurvivorError(error.message);
      } finally {
        setSurvivorLoading(false);
      }
    };

    fetchSurvivorStandings();
  }, [location.search]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // loading states
  if (selectedTab === 0 && regularLoading) return <div>Loading regular standings...</div>;
  if (selectedTab === 1 && survivorLoading) return <div>Loading survivor standings...</div>;
  if (selectedTab === 0 && regularError) return <div>Error loading regular standings: {regularError}</div>;
  if (selectedTab === 1 && survivorError) return <div>Error loading survivor standings: {survivorError}</div>;

  return (
    <Paper sx={{ pl: 0, pr: 0, pt: 4, mt: 0, elevation: 0 }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          justifyContent: "center",
        }}
        gutterBottom
      >
        {selectedTab === 0 ? "Entry Standings" : "Survivor Standings"}
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
        {selectedTab === 0 ? (
          <Standings standings={regularStandings} />
        ) : (
          <SurvivorStandings standings={survivorStandings} />
        )}
      </Box>
    </Paper>
  );
}
