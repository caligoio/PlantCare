# ===== Tahap 1: build aplikasi React (Vite) =====
FROM node:22-alpine AS build
WORKDIR /app

# Salin file dependency dulu supaya layer npm install bisa di-cache
COPY package*.json ./
RUN npm ci

# Salin sisa kode, lalu build ke folder dist/
COPY . .
RUN npm run build

# ===== Tahap 2: sajikan hasil build dengan Nginx =====
FROM nginx:alpine

# Konfigurasi Nginx agar rute React Router (/koleksi, /tanaman/1) tidak 404
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ambil hanya hasil build dari tahap 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]