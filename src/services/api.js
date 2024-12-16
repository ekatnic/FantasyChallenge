import axios from "axios";

const API_URL = "/api/entries/";
// const API_URL = "http://127.0.0.1:8000/";

export const getEntries = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
};
