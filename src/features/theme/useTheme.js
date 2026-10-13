import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "plantcareTheme";

// Urutan prioritas: pilihan tersimpan -> pengaturan sistem -> terang
function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // localStorage tidak tersedia, lanjut ke pengaturan sistem
  }
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// Dijalankan sekali saat modul dimuat, supaya tema langsung terpasang
// di semua halaman (bukan hanya setelah tombol toggle muncul).
applyTheme(getInitialTheme());

export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.error("Gagal menyimpan tema:", error);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, isDark: theme === "dark", toggleTheme };
}
