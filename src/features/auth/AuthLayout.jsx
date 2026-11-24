import { Link } from "react-router-dom";
import ThemeToggle from "../theme/ThemeToggle";
import "./Auth.css";

// Kerangka bersama untuk halaman Masuk dan Daftar:
// baris atas (kembali + toggle tema), kartu berisi formulir, dan tautan di bawahnya.
export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <section className="auth">
      <div className="auth__topbar">
        <Link to="/" className="auth__back">
          <span aria-hidden="true">←</span> Kembali ke katalog
        </Link>
        <ThemeToggle />
      </div>

      <div className="auth__card">
        <div className="auth__logo" aria-hidden="true">
          🪴
        </div>
        {title && <h2 className="auth__title">{title}</h2>}
        {subtitle && <p className="auth__subtitle">{subtitle}</p>}
        {children}
      </div>

      {footer && <p className="auth__footer">{footer}</p>}
    </section>
  );
}
