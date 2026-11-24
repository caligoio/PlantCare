import { useCallback, useEffect, useState } from "react";
import useAuth from "../auth/useAuth";

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
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

// Hooks Pattern: semua akses data koleksi ada di sini.
// Fungsi aksi melempar error, jadi komponen yang memanggil bisa menampilkan pesannya.
export default function useCollection() {
  const { clearSession } = useAuth();
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Semua pemanggilan API lewat sini. Kalau server membalas 401 (misalnya sesi habis),
  // sesi di klien dihapus; ProtectedRoute lalu mengarahkan ke /masuk.
  const call = useCallback(
    async (path, options) => {
      try {
        return await request(path, options);
      } catch (err) {
        if (err.status === 401) clearSession();
        throw err;
      }
    },
    [clearSession]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCollection(await call());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [call]);

  useEffect(() => {
    load();
  }, [load]);

  const addToCollection = async (plantId, nickname) => {
    const item = await call("", {
      method: "POST",
      body: JSON.stringify({ plantId, nickname, lastWatered: todayLocal() }),
    });
    setCollection((current) => [item, ...current]);
    return item;
  };

  const markAsWatered = async (id, lastWatered = todayLocal()) => {
    const updated = await call(`/${id}/water`, {
      method: "PATCH",
      body: JSON.stringify({ lastWatered }),
    });
    setCollection((current) => current.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const renamePlant = async (id, nickname) => {
    const updated = await call(`/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ nickname }),
    });
    setCollection((current) => current.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const removeFromCollection = async (id) => {
    await call(`/${id}`, { method: "DELETE" });
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