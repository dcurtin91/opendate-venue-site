import { useState, useEffect } from "react";
import { getEvents, getEvent, getPastEvents } from "../lib/api";

export function useEvents(options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { page = 1, genre, past = false, venueId } = options;

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetcher = past ? getPastEvents : getEvents;
    fetcher({ page, genre, venueId })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [page, genre, past, venueId]);

  return { data, loading, error };
}

export function useEvent(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    getEvent(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}
