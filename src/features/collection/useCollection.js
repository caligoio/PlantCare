import { useCallback, useEffect, useState } from "react";

const API_URL = "/api/collection";

// Tanggal lokal pengguna dalam format YYYY-MM-DD (bukan UTC),
// supaya "sudah disiram hari ini" tidak mundur satu hari.
function todayLocal() {
  return new Date().toLocaleDateString("en-CA");
}

async function request(path = "", options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let message = "Permintaan gagal. Coba lagi.";
    try {
      const body = await response.json();
      if (body.message) message = body.message;
    } catch {
      // body bukan JSON, pakai pesan bawaan
    }
    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
}

// Hooks Pattern: semua akses data koleksi ada di sini.
// Fungsi aksi melempar error, jadi komponen yang memanggil bisa menampilkan pesannya.
export default function useCollection() {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCollection(await request());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addToCollection = async (plantId, nickname) => {
    const item = await request("", {
      method: "POST",
      body: JSON.stringify({ plantId, nickname, lastWatered: todayLocal() }),
    });
    setCollection((current) => [item, ...current]);
    return item;
  };

  const markAsWatered = async (id, lastWatered = todayLocal()) => {
    const updated = await request(`/${id}/water`, {
      method: "PATCH",
      body: JSON.stringify({ lastWatered }),
    });
    setCollection((current) => current.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const renamePlant = async (id, nickname) => {
    const updated = await request(`/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ nickname }),
    });
    setCollection((current) => current.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const removeFromCollection = async (id) => {
    await request(`/${id}`, { method: "DELETE" });
    setCollection((current) => current.filter((item) => item.id !== id));
  };

  return {
    collection,
    loading,
    error,
    reload: load,
    addToCollection,
    markAsWatered,
    renamePlant,
    removeFromCollection,
  };
}
