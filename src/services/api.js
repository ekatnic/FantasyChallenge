import axios from "axios";
import { playoffTeams } from "../constants";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export const getEntries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/entries/?year=2025`);
    return response.data;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
};

export const getEntry = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/entries/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching entry:", error);
    throw error;
  }
};

export const getEntryRoster = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/entries/${id}/roster/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching entry:", error);
    throw error;
  }
};

export const deleteEntry = async (id) => {
  try {
  const response = await axios.delete(`${BASE_URL}/api/entries/${id}/`);
  return response.data;
  } catch (error) {
    console.error("Error fetching entry:", error);
    throw error;
  }
};

export const getPlayers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/players/`, {
      params: { teams: playoffTeams.join(',') }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};

export const updateEntry = async (id, formData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/entries/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error;
  }
};

export const postEntry = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/entries/`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating entry:", error);
    throw error;
  }
};

export const getStandings = async (params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/standings/`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};

export const getPlayerOwnership = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/player-ownership/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching player ownership:", error);
    throw error;
  }
};

export const getPlayerWeeklyStats = async (playerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/player-weekly-stats/${playerId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching player ownership:", error);
    throw error;
  }
};

export const getEntryRosterProfiles = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/entries/${id}/roster-profiles/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching entry:", error);
    throw error;
  }
};

