import useTheme from "./useTheme";
import "./theme.css";

// Tombol saklar untuk berpindah antara mode terang dan gelap.
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      className="theme-toggle"
      onClick={toggleTheme}
    >
      <span className="theme-toggle__label">Mode gelap</span>
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__knob">{isDark ? "🌙" : "☀️"}</span>
      </span>
    </button>
  );
}
