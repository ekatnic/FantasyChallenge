// This is a basic setup for CreateEntry form submittion
// NOTE: Added Material UI components for easy styling/strucuter, im happy to not use this (or any component library) but this was fastest
// NOTE: way for me to get a form setup and looking decent

// TODO: I think a big blob containing all players-position-team mappings sent to each client could be a good simple idea,
// TODO: Then we just use that on the client, build all the components from that, etc.
// TODO: Then send back the form data back to the server

// TODO: Logic for this component is definitely not correct, but it's a start

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Container,
  Paper,
} from "@mui/material";

// mock api data
const playerOptions = {
  quarterbacks: ["Patrick Mahomes", "Josh Allen", "Lamar Jackson"],
  runningBacks: ["Christian McCaffrey", "Derrick Henry", "Saquon Barkley"],
  wideReceivers: ["Justin Jefferson", "Tyreek Hill", "CeeDee Lamb"],
  tightEnds: ["Travis Kelce", "George Kittle", "Mark Andrews"],
  defenses: ["San Francisco 49ers", "Baltimore Ravens", "Buffalo Bills"],
};

export function CreateEntry() {
  // I presume an object like this is right way to do a form state variable
  const [formData, setFormData] = useState({
    quarterback: "",
    running_back1: "",
    running_back2: "",
    wide_receiver1: "",
    wide_receiver2: "",
    tight_end: "",
    flex1: "",
    flex2: "",
    flex3: "",
    flex4: "",
    scaled_flex: "",
    defense: "",
    captain: null,
  });

  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    const usedTeams = new Set();

    // TODO: could move to a constants files
    const requiredFields = [
      "quarterback",
      "running_back1",
      "running_back2",
      "wide_receiver1",
      "wide_receiver2",
      "tight_end",
      "flex1",
      "flex2",
      "flex3",
      "flex4",
      "scaled_flex",
      "defense",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // TODO: Actually correct logic to check you cant have multiple players from the same team
    const fieldsToCheckTeam = [
      "running_back1",
      "running_back2",
      "wide_receiver1",
      "wide_receiver2",
      "tight_end",
      "flex1",
      "flex2",
      "flex3",
      "flex4",
      "defense",
    ];

    // TODO: this is stupid and doesnt actually do what we want,
    // TODO: we need a PROPER PLAYER TO TEAM MAPPING
    fieldsToCheckTeam.forEach((field) => {
      const player = formData[field];
      if (player) {
        const team = getPlayerTeam(player);
        if (usedTeams.has(team)) {
          newErrors[field] =
            "Cannot select multiple players from the same team";
        } else {
          usedTeams.add(team);
        }
      }
    });

    // TODO: i know we were planning on dropping this
    if (!formData.captain) {
      newErrors.captain = "You must select a captain";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // TODO: Make a call to back end and get player/team/position mappings blob
  // TODO: Add a useEffect to get this data on component mount
  const getPlayerTeam = (player) => {
    const teamMappings = {
      "Patrick Mahomes": "Kansas City Chiefs",
      "Josh Allen": "Buffalo Bills",
      "Lamar Jackson": "Baltimore Ravens",
      "Christian McCaffrey": "San Francisco 49ers",
      "Derrick Henry": "Balitmore Ravens",
      "Saquon Barkley": "Philadelphia Eagles",
      "Travis Kelce": "Kansas City Chiefs",
      "George Kittle": "San Francisco 49ers",
      "Mark Andrews": "Baltimore Ravens",

      "San Francisco 49ers": "San Francisco 49ers",
    };
    return teamMappings[player] || "Unknown";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmissionError(null);

    if (validateForm()) {
      try {
        // Simulate API call
        console.log("Submitting Entry:", formData);
        // Replace with actual API call
        alert("Entry submitted successfully!");
      } catch (error) {
        setSubmissionError("Error submitting entry. Please try again.");
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderSelect = (label, field, options, isCaptain = false) => (
    <FormControl fullWidth margin="normal" error={!!errors[field]}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={formData[field]}
        onChange={(e) => {
          handleChange(field, e.target.value);
          if (isCaptain) handleChange("captain", e.target.value);
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {submissionError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submissionError}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader
                title="Create Your Fantasy Football Playoff Entry"
                titleTypographyProps={{ variant: "h4" }}
              />
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      {renderSelect(
                        "Quarterback",
                        "quarterback",
                        playerOptions.quarterbacks
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {renderSelect(
                        "Running Back 1",
                        "running_back1",
                        playerOptions.runningBacks,
                        true
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {renderSelect(
                        "Running Back 2",
                        "running_back2",
                        playerOptions.runningBacks
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {renderSelect(
                        "Wide Receiver 1",
                        "wide_receiver1",
                        playerOptions.wideReceivers,
                        true
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {renderSelect(
                        "Wide Receiver 2",
                        "wide_receiver2",
                        playerOptions.wideReceivers
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {renderSelect(
                        "Tight End",
                        "tight_end",
                        playerOptions.tightEnds,
                        true
                      )}
                    </Grid>

                    {/* Flex Positions */}
                    <Grid item xs={12} sm={6}>
                      {renderSelect("Flex 1", "flex1", [
                        ...playerOptions.runningBacks,
                        ...playerOptions.wideReceivers,
                        ...playerOptions.tightEnds,
                      ])}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {renderSelect("Flex 2", "flex2", [
                        ...playerOptions.runningBacks,
                        ...playerOptions.wideReceivers,
                        ...playerOptions.tightEnds,
                      ])}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {renderSelect("Flex 3", "flex3", [
                        ...playerOptions.runningBacks,
                        ...playerOptions.wideReceivers,
                        ...playerOptions.tightEnds,
                      ])}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {renderSelect("Flex 4", "flex4", [
                        ...playerOptions.runningBacks,
                        ...playerOptions.wideReceivers,
                        ...playerOptions.tightEnds,
                      ])}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {renderSelect("Scaled Flex", "scaled_flex", [
                        ...playerOptions.runningBacks,
                        ...playerOptions.wideReceivers,
                        ...playerOptions.tightEnds,
                      ])}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {renderSelect(
                        "Defense",
                        "defense",
                        playerOptions.defenses,
                        true
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Submit Entry
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title="Full Rules"
                    titleTypographyProps={{ variant: "h6" }}
                  />
                  <CardContent>
                    <Typography variant="body2">
                      <ul>
                        <li>Create a lineup of 12 players</li>
                        <li>Only one player per team allowed</li>
                        <li>Points will NOT be doubled in the Super Bowl</li>
                        <li>Cannot combine captain and scaled FLEX</li>
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title="Captain and Scaled FLEX Rules"
                    titleTypographyProps={{ variant: "h6" }}
                  />
                  <CardContent>
                    <Typography variant="body2">
                      <strong>Captain:</strong> Receives 1.5x points
                      <br />
                      <br />
                      <strong>Scaled FLEX Points:</strong>
                      <ul>
                        <li>50%+ ownership: No multiplier</li>
                        <li>25-50%: 1.2x multiplier</li>
                        <li>12.5-25%: 1.3x multiplier</li>
                        <li>5-12.5%: 1.5x multiplier</li>
                        <li>0-5%: 1.75x multiplier</li>
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default CreateEntry;
