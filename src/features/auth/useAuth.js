import { createContext, useContext } from "react";

// Objek context. Diisi nilainya oleh AuthProvider di AuthContext.jsx.
export const AuthContext = createContext(null);

// Hooks Pattern: komponen cukup memanggil useAuth(), tanpa tahu cara kerja sesi.
//
// const { user, loading, login, register, logout } = useAuth();
//   user:    { id, name, email } atau null
//   loading: true selama aplikasi mengecek sesi saat pertama dimuat
//   login(email, password), register(name, email, password): async,
//     melempar Error(message) jika gagal
//   logout(): async
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>.");
  }
  return context;
}

export { useAuth };
