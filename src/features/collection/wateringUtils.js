// Semua perhitungan jadwal siram ada di sini (fungsi murni, mudah dites).
// Tanggal memakai format "YYYY-MM-DD" dan waktu lokal, bukan UTC.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Date -> "2026-10-13"
export function toDateString(date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

// "2026-10-13" -> Date (jam 00:00 waktu lokal)
export function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayString() {
  return toDateString(new Date());
}

// Sisa hari menuju jadwal siram berikutnya.
// 0 = hari ini, negatif = terlambat, positif = masih beberapa hari lagi.
export function daysUntilWatering(lastWatered, wateringIntervalDays) {
  const daysSince = Math.round(
    (parseDate(todayString()) - parseDate(lastWatered)) / MS_PER_DAY
  );
  return wateringIntervalDays - daysSince;
}

export function isDueToday(lastWatered, wateringIntervalDays) {
  return daysUntilWatering(lastWatered, wateringIntervalDays) <= 0;
}

// Tanggal jadwal siram berikutnya: lastWatered + wateringIntervalDays
export function getNextWateringDate(lastWatered, wateringIntervalDays) {
  const next = parseDate(lastWatered);
  next.setDate(next.getDate() + wateringIntervalDays);
  return toDateString(next);
}

// "2026-10-13" -> "13 Oktober 2026" (atau "Selasa, 13 Oktober 2026")
export function formatDate(str, withWeekday = false) {
  return parseDate(str).toLocaleDateString("id-ID", {
    ...(withWeekday && { weekday: "long" }),
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Urutkan dari yang paling mendesak (paling terlambat) ke yang paling lama.
// Item tanpa data tanaman diletakkan di akhir.
export function sortByUrgency(items) {
  const score = (item) =>
    item.plant
      ? daysUntilWatering(item.lastWatered, item.plant.wateringIntervalDays)
      : Infinity;
  return [...items].sort((a, b) => score(a) - score(b));
}
