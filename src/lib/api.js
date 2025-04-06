// RAWG API service
const API_KEY = "851242078ad04b68a686eb2e3d0ad051";
const BASE_URL = "https://api.rawg.io/api";

export const fetchGames = async ({
  pageParam = 1,
  query = "",
  filters = {},
}) => {
  try {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      page: pageParam,
      page_size: 20,
    });

    // Add search query if provided
    if (query) {
      searchParams.append("search", query);
      searchParams.append("search_precise", true);
    }

    // Add filters if provided
    if (filters) {
      // Sorting
      if (filters.ordering) {
        searchParams.append("ordering", filters.ordering);
      }

      // Platforms
      if (filters.platforms) {
        searchParams.append("platforms", filters.platforms);
      }

      // Genres
      if (filters.genres) {
        searchParams.append("genres", filters.genres);
      }

      // Rating range
      if (filters.rating_min !== undefined) {
        searchParams.append("rating_min", filters.rating_min);
      }
      if (filters.rating_max !== undefined) {
        searchParams.append("rating_max", filters.rating_max);
      }
    }

    const response = await fetch(`${BASE_URL}/games?${searchParams}`);

    if (!response.ok) {
      throw new Error("Failed to fetch games");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
};

export const fetchGameDetails = async (gameId) => {
  try {
    const response = await fetch(`${BASE_URL}/games/${gameId}?key=${API_KEY}`);

    if (!response.ok) {
      throw new Error("Failed to fetch game details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw error;
  }
};

export const fetchGameScreenshots = async (gameId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch game screenshots");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching game screenshots:", error);
    throw error;
  }
};

// Fetch platforms for filtering
export const fetchPlatforms = async () => {
  try {
    const response = await fetch(`${BASE_URL}/platforms?key=${API_KEY}`);

    if (!response.ok) {
      throw new Error("Failed to fetch platforms");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching platforms:", error);
    throw error;
  }
};

// Fetch genres for filtering
export const fetchGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genres?key=${API_KEY}`);

    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};
