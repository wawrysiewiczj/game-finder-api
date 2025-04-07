import axios from "axios";

// Create axios instance for RAWG API
const rawgApi = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: import.meta.env.VITE_RAWG_API_KEY, // API key from .env file
  },
  // Add default timeout
  timeout: 10000, // 10 seconds
});

// Add error handling interceptor
rawgApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors to console in development
    if (import.meta.env.DEV) {
      console.error("API Error:", error);
    }

    // Format error message for better user experience
    let message = "An error occurred while fetching data.";

    if (error.response) {
      // Server returned an error response
      const status = error.response.status;

      if (status === 401 || status === 403) {
        message = "Authentication error. Please check your API key.";
      } else if (status === 404) {
        message = "The requested resource was not found.";
      } else if (status === 429) {
        message = "Too many requests. Please try again later.";
      } else if (status >= 500) {
        message = "Server error. Please try again later.";
      }
    } else if (error.request) {
      // Request made but no response received
      message =
        "Could not connect to the server. Please check your internet connection.";
    }

    // Add custom message to error object
    error.friendlyMessage = message;
    return Promise.reject(error);
  }
);

/**
 * Get popular games with pagination
 * @param {Object} params - Query parameters
 * @returns {Promise} - API response
 */
export const getGames = async (params = {}) => {
  try {
    const response = await rawgApi.get("/games", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get game details by ID
 * @param {string|number} id - Game ID
 * @returns {Promise} - API response
 */
export const getGameDetails = async (id) => {
  try {
    const response = await rawgApi.get(`/games/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get game screenshots by ID
 * @param {string|number} id - Game ID
 * @returns {Promise} - API response
 */
export const getGameScreenshots = async (id) => {
  try {
    const response = await rawgApi.get(`/games/${id}/screenshots`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get game genres
 * @returns {Promise} - API response
 */
export const getGenres = async () => {
  try {
    const response = await rawgApi.get("/genres");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get game platforms
 * @returns {Promise} - API response
 */
export const getPlatforms = async () => {
  try {
    const response = await rawgApi.get("/platforms");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get game stores
 * @returns {Promise} - API response
 */
export const getStores = async () => {
  const response = await rawgApi.get("/stores");
  return response.data;
};

export default rawgApi;
