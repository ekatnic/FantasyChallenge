import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const getEntries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/entries/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
};

export const getPlayers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/players/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
};
