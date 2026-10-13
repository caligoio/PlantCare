# Plantcare

Aplikasi web untuk membantu pengguna merawat tanaman lewat katalog tanaman, koleksi pribadi, dan pengingat jadwal penyiraman.

## Deskripsi Proyek

### Latar Belakang

Merawat tanaman hias terlihat mudah, tetapi banyak tanaman mati karena kesalahan yang sebenarnya bisa dihindari. Pemilik tanaman sering lupa kapan terakhir menyiram, tidak tahu seberapa sering tanaman perlu disiram, atau salah memberi cahaya. Setiap jenis tanaman punya kebutuhan yang berbeda. Monstera tidak perlu disiram sesering kaktus, dan sirih gading butuh cahaya yang berbeda dari lidah mertua.

Pemula biasanya mencatat jadwal secara manual atau mengandalkan ingatan. Cara itu mudah terlewat, apalagi ketika tanaman yang dimiliki sudah lebih dari satu. Informasi perawatan juga tersebar di banyak situs dan media sosial, sehingga pengguna harus mencarinya satu per satu.

### Tujuan

1. Menyediakan katalog tanaman yang memuat informasi perawatan, seperti kebutuhan cahaya, tingkat perawatan, dan interval penyiraman.
2. Memungkinkan pengguna menyimpan tanaman yang mereka miliki ke dalam koleksi pribadi, lengkap dengan nama panggilan.
3. Mengingatkan pengguna tanaman mana yang perlu disiram hari ini, berdasarkan tanggal terakhir siram dan interval penyiraman tiap tanaman.
4. Menyajikan semuanya dalam satu aplikasi web yang sederhana dan mudah dipakai, dengan fokus pada pengembangan front-end.

### Manfaat

- **Perawatan lebih teratur.** Pengguna tidak perlu mengingat jadwal siram setiap tanaman. Aplikasi menghitungnya dan menampilkan yang perlu disiram hari ini.
- **Informasi terkumpul di satu tempat.** Pengguna bisa mengecek kebutuhan setiap tanaman di katalog tanpa mencari ke banyak sumber.
- **Mengurangi risiko tanaman mati.** Penyiraman yang tepat waktu membantu mencegah tanaman kekeringan atau kelebihan air.
- **Cocok untuk pemula.** Fitur yang ringkas dan tampilan yang jelas memudahkan orang yang baru mulai merawat tanaman.
- **Data tetap tersimpan.** Koleksi disimpan di browser pengguna, jadi tidak perlu membuat akun untuk mulai memakainya.

### Target Pengguna

Pemilik tanaman hias di rumah, terutama pemula dan orang dengan jadwal padat yang ingin merawat tanaman dengan lebih teratur.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.