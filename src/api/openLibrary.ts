import axios from "axios";

const BASE_URL = "https://openlibrary.org";

/**
 * Search books using the official OpenLibrary Search API
 * https://openlibrary.org/dev/docs/api/search
 */
export async function searchBooks(query: string) {
  try {
    const res = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        q: query,
        limit: 20, // fetch first 20 results
      },
    });

    return res.data; // return complete API response
  } catch (error: any) {
    console.error("OpenLibrary API Error:", error.message);
    return { docs: [] };
  }
}

/**
 * Construct cover image URL using OpenLibrary Covers API
 * https://openlibrary.org/dev/docs/api/covers
 */
export function coverUrl(cover_i?: number, size: "S" | "M" | "L" = "M") {
  return cover_i
    ? `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg`
    : "https://via.placeholder.com/150"; // fallback image
}
