import axios from "axios";

// NOTE: Setting no BASE_URL to NOTHING as to not change the formatted strings
// NOTE: And this is working because the React app is being servered from Django on the same port i beleive
// NOTE: This may just be a problem with my local setup.. not sure at this point

// const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const BASE_URL = "";

export const getEntries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/entries/`);
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

export const getPlayers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/players/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching entries:", error);
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
