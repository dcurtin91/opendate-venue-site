const API_URL = import.meta.env.VITE_OPENDATE_API_URL;
const SHARED_KEY = import.meta.env.VITE_OPENDATE_SHARED_KEY;
const VENUE_ID = import.meta.env.VITE_VENUE_ID;

async function fetchApi(endpoint, params = {}) {
  const url = new URL(`${API_URL}${endpoint}`);
  url.searchParams.set("shared_key", SHARED_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getEvents({ page = 1, perPage = 30, genre } = {}) {
  return fetchApi("/confirms", {
    venue_id: VENUE_ID,
    page,
    per_page: perPage,
    genre,
    "q[start_time_gteq]": new Date().toISOString(),
    "q[s]": "start_time asc",
  });
}

export async function getEvent(id) {
  return fetchApi(`/confirms/${id}`);
}

export async function getPastEvents({ page = 1, perPage = 30 } = {}) {
  return fetchApi("/confirms", {
    venue_id: VENUE_ID,
    page,
    per_page: perPage,
    "q[start_time_lt]": new Date().toISOString(),
    "q[s]": "start_time desc",
  });
}
