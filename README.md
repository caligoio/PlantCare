# Plantcare
Aplikasi web untuk membantu pengguna merawat tanaman lewat katalog tanaman, koleksi pribadi, dan pengingat jadwal penyiraman.
Link Docker Repository: https://hub.docker.com/r/caligoio/plantcare

## Deskripsi Proyek

### Latar Belakang

Merawat tanaman hias terlihat mudah, tetapi banyak tanaman mati karena kesalahan yang sebenarnya bisa dihindari. Pemilik tanaman sering lupa kapan terakhir menyiram, tidak tahu seberapa sering tanaman perlu disiram, atau salah memberi cahaya. Setiap jenis tanaman punya kebutuhan yang berbeda. Monstera tidak perlu disiram sesering kaktus, dan sirih gading butuh cahaya yang berbeda dari lidah mertua.

Pemula biasanya mencatat jadwal secara manual atau mengandalkan ingatan. Cara itu mudah terlewat, apalagi ketika tanaman yang dimiliki sudah lebih dari satu. Informasi perawatan juga tersebar di banyak situs dan media sosial, sehingga pengguna harus mencarinya satu per satu.

### Tujuan

1. Menyediakan katalog tanaman yang memuat informasi perawatan, seperti kebutuhan cahaya, tingkat perawatan, dan interval penyiraman.
2. Memungkinkan pengguna menyimpan tanaman yang mereka miliki ke dalam koleksi pribadi, lengkap dengan nama panggilan.
3. Mengingatkan pengguna tanaman mana yang perlu disiram hari ini, berdasarkan tanggal terakhir siram dan interval penyiraman tiap tanaman.
4. Menyajikan semuanya dalam satu aplikasi web yang sederhana dan mudah dipakai.

### Manfaat

- **Perawatan lebih teratur.** Pengguna tidak perlu mengingat jadwal siram setiap tanaman. Aplikasi menghitungnya dan menampilkan yang perlu disiram hari ini.
- **Informasi terkumpul di satu tempat.** Pengguna bisa mengecek kebutuhan setiap tanaman di katalog tanpa mencari ke banyak sumber.
- **Mengurangi risiko tanaman mati.** Penyiraman yang tepat waktu membantu mencegah tanaman kekeringan atau kelebihan air.
- **Cocok untuk pemula.** Fitur yang ringkas dan tampilan yang jelas memudahkan orang yang baru mulai merawat tanaman.
- **Data tersimpan di server.** Katalog dan koleksi disimpan di database PostgreSQL, dan pengguna masuk lewat akun (email dan kata sandi).

### Target Pengguna

Pemilik tanaman hias di rumah, terutama pemula dan orang dengan jadwal padat yang ingin merawat tanaman dengan lebih teratur.

## Teknologi yang Digunakan

### Backend

| Komponen | Teknologi | Fungsi |
| --- | --- | --- |
| Runtime | **Node.js 22** (ES Modules) | Menjalankan server |
| Framework | **Express 5** | REST API (`/api/*`) |
| Database | **PostgreSQL 16** | Menyimpan tanaman, koleksi, dan pengguna |
| Driver database | **pg** (`node-postgres`) | Koneksi dan query SQL (tanpa ORM) |
| Autentikasi | **jsonwebtoken** (JWT, HS256) | Token sesi berlaku 7 hari |
| Hash kata sandi | **bcryptjs** | Kata sandi tidak pernah disimpan sebagai teks asli |
| Cookie | **cookie-parser** | Membaca cookie sesi `plantcare_token` |

Token JWT dikirim lewat cookie `httpOnly` dengan `sameSite=lax`, sehingga tidak bisa dibaca JavaScript di browser. Atribut `secure` diatur lewat variabel `COOKIE_SECURE`.

Saat server menyala, `initDb()` membuat tabel dari `backend/db/schema.sql` dan mengisi data awal tanaman dari `backend/db/plants.seed.js`. Proses ini aman dijalankan berulang kali.

### Frontend

- **React 19** dan **Vite 8**
- **React Router 7** untuk navigasi
- CSS biasa dengan tema terang/gelap

### Infrastruktur

- **Docker** dan **Docker Compose** (service `db`, `backend`, `frontend`)
- **Nginx** menyajikan hasil build React dan meneruskan `/api/*` ke backend

## Arsitektur

```
Browser ──► Nginx (frontend, :8080)
              ├── /          → file statis React (hasil build Vite)
              └── /api/*     → Express (backend, :3000) ──► PostgreSQL (db, :5432)
```

Frontend memakai alamat relatif (`/api/...`), jadi cookie sesi terkirim otomatis tanpa konfigurasi CORS.

## Struktur Folder

```
plantcare/
├── src/                      # Frontend React
│   └── features/
│       ├── auth/             # Login, daftar, AuthContext, ProtectedRoute
│       ├── catalog/          # Katalog dan detail tanaman
│       ├── collection/       # Koleksi dan jadwal siram
│       └── theme/            # Mode terang/gelap
├── backend/
│   ├── src/
│   │   ├── server.js         # Entry point Express
│   │   ├── db.js             # Koneksi pool PostgreSQL
│   │   ├── auth.js           # JWT dan cookie
│   │   ├── middleware/requireAuth.js
│   │   └── routes/           # auth.js, plants.js, collection.js
│   ├── db/
│   │   ├── schema.sql        # Skema tabel
│   │   ├── plants.seed.js    # Data awal tanaman
│   │   ├── init.js           # Membuat tabel dan seed
│   │   └── seed.js           # Menjalankan init secara manual
│   └── Dockerfile
├── Dockerfile                # Build frontend (Vite) + Nginx
├── nginx.conf
└── docker-compose.yml
```

## Endpoint API

| Method | Endpoint | Keterangan | Perlu login |
| --- | --- | --- | --- |
| GET | `/api/health` | Cek status server | Tidak |
| POST | `/api/auth/register` | Daftar akun baru | Tidak |
| POST | `/api/auth/login` | Masuk | Tidak |
| POST | `/api/auth/logout` | Keluar | Tidak |
| GET | `/api/auth/me` | Data pengguna yang sedang login | Ya |
| GET | `/api/plants` | Daftar semua tanaman | Tidak |
| GET | `/api/plants/:id` | Detail satu tanaman | Tidak |
| GET | `/api/collection` | Daftar koleksi | Lihat catatan |
| POST | `/api/collection` | Tambah tanaman ke koleksi | Lihat catatan |
| PATCH | `/api/collection/:id/water` | Tandai sudah disiram | Lihat catatan |
| PATCH | `/api/collection/:id` | Ganti nama panggilan | Lihat catatan |
| DELETE | `/api/collection/:id` | Hapus dari koleksi | Lihat catatan |

Format error selalu `{ "message": "..." }`.

> **Catatan:** halaman `/koleksi` di frontend sudah dilindungi `ProtectedRoute`, dan kolom `user_id` sudah ada di tabel `collection`. Namun route `/api/collection` di backend belum memakai `requireAuth` dan belum memfilter data per pengguna. Ini perlu dilengkapi agar koleksi benar-benar terpisah antar akun.

## Menjalankan Aplikasi

### Dengan Docker Compose (disarankan)

1. Buat file `.env` di root proyek:

   ```env
   DB_USER=plantcare
   DB_PASSWORD=ganti_dengan_sandi_kuat
   DB_NAME=plantcare

   # Minimal 16 karakter, makin acak makin baik.
   # Buat dengan: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   JWT_SECRET=isi_dengan_rahasia_acak

   # Ubah ke true hanya jika diakses lewat HTTPS
   COOKIE_SECURE=false
   ```

2. Jalankan:

   ```bash
   docker compose up --build
   ```

3. Buka http://localhost:8080 (frontend). API backend juga terbuka langsung di http://localhost:3000.

`JWT_SECRET` wajib diisi. Compose akan berhenti dengan pesan error jika kosong, dan backend menolak menyala jika kurang dari 16 karakter.

### Mode pengembangan

Jalankan database dan backend lewat Docker, lalu frontend dengan Vite:

```bash
docker compose up --build db backend
npm install
npm run dev
```

Vite berjalan di http://localhost:5173 dan meneruskan `/api` ke `http://localhost:3000` (lihat `vite.config.js`).

### Perintah lain

```bash
npm run build           # build frontend ke dist/
npm run lint            # cek ESLint
cd backend && npm run seed   # buat tabel dan isi data awal secara manual
```

## Variabel Lingkungan (Backend)

| Variabel | Bawaan | Keterangan |
| --- | --- | --- |
| `DB_HOST` | `localhost` | Alamat PostgreSQL (`db` di Docker Compose) |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `DB_USER` | `plantcare` | Pengguna database |
| `DB_PASSWORD` | `plantcare_pass` | Kata sandi database |
| `DB_NAME` | `plantcare` | Nama database |
| `PORT` | `3000` | Port server Express |
| `JWT_SECRET` | (wajib) | Rahasia penanda tangan token, minimal 16 karakter |
| `COOKIE_SECURE` | `false` | `true` jika memakai HTTPS |

## Skema Database

- `plants`: katalog tanaman (nama, emoji, deskripsi, cahaya, tingkat perawatan, interval siram)
- `users`: akun pengguna (nama, email unik, hash kata sandi)
- `collection`: tanaman milik pengguna (nama panggilan, tanggal terakhir siram, `plant_id`, `user_id`)
