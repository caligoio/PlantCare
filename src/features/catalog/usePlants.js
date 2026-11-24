import { useState, useEffect, useCallback } from "react";

// Mengambil daftar tanaman dari backend (GET /api/plants).
// Mengembalikan { plants, loading, error, reload }.
export default function usePlants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/plants", { signal });
      if (!response.ok) throw new Error(`Server menjawab ${response.status}`);
      setPlants(await response.json());
    } catch (err) {
      if (err.name === "AbortError") return;
      setError("Gagal memuat daftar tanaman. Coba lagi.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const reload = useCallback(() => load(), [load]);

  return { plants, loading, error, reload };
}