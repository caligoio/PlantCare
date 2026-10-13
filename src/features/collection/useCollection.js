import { useState, useEffect, useCallback } from "react";

// Kesepakatan tim: key localStorage harus persis seperti ini.
const STORAGE_KEY = "plantCollection";

/* ---------- Helper tanggal (pakai waktu lokal, bukan UTC) ---------- */

// Hasil: "2026-10-13"
export function todayString() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// "2026-10-13" -> Date (jam 00:00 waktu lokal)
function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Selisih hari antara dua string tanggal (b - a)
function diffInDays(a, b) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((parseDate(b) - parseDate(a)) / MS_PER_DAY);
}

// Sisa hari menuju jadwal siram berikutnya.
// 0 = hari ini, negatif = sudah terlambat, positif = masih beberapa hari lagi.
export function daysUntilWatering(lastWatered, wateringIntervalDays) {
  const daysSince = diffInDays(lastWatered, todayString());
  return wateringIntervalDays - daysSince;
}

// Tanaman perlu disiram jika sisa hari <= 0
export function isDueToday(lastWatered, wateringIntervalDays) {
  return daysUntilWatering(lastWatered, wateringIntervalDays) <= 0;
}

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
