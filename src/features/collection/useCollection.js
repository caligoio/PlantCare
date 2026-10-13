import { useState, useEffect, useCallback } from "react";
import { todayString } from "./wateringUtils";

// Kesepakatan tim: key localStorage harus persis seperti ini.
const STORAGE_KEY = "plantCollection";

/* ---------- Akses localStorage ---------- */

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Gagal menyimpan koleksi:", error);
  }
}

/* ---------- Hook utama ---------- */

/**
 * Bentuk satu item (sesuai kesepakatan tim):
 * { id, plantId, nickname, lastWatered }
 */
export default function useCollection() {
  const [collection, setCollection] = useState(readStorage);

  // Simpan ke localStorage setiap koleksi berubah
  useEffect(() => {
    writeStorage(collection);
  }, [collection]);

  // Sinkron jika koleksi diubah dari tab browser lain
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setCollection(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Dipakai Orang 1 di PlantCard: addToCollection(plantId)
  // nickname bersifat opsional; kosong = tampilkan nama tanaman di kartu.
  const addToCollection = useCallback((plantId, nickname = "") => {
    const newItem = {
      id: Date.now(),
      plantId,
      nickname: nickname.trim(),
      lastWatered: todayString(),
    };
    setCollection((prev) => [...prev, newItem]);
    return newItem;
  }, []);

  const removeFromCollection = useCallback((id) => {
    setCollection((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Tombol "Sudah disiram": set tanggal terakhir siram ke hari ini
  const markAsWatered = useCallback((id) => {
    setCollection((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, lastWatered: todayString() } : item
      )
    );
  }, []);

  const updateNickname = useCallback((id, nickname) => {
    setCollection((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, nickname: nickname.trim() } : item
      )
    );
  }, []);

  return {
    collection,
    addToCollection,
    removeFromCollection,
    markAsWatered,
    updateNickname,
  };
}
