import plantsData from "./plantsData";

// Hook sederhana: mengembalikan daftar tanaman.
// Nanti di sini bisa ditambah state untuk filter.
export default function usePlants() {
  return { plants: plantsData };
}
