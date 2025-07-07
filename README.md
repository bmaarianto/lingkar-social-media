# Lingkar

Lingkar adalah aplikasi komunitas sosial berbasis web yang memungkinkan pengguna untuk membuat postingan, memberikan komentar, dan berinteraksi satu sama lain. Proyek ini dibangun menggunakan React, TypeScript, Vite, Supabase, dan TailwindCSS.

## Fitur Utama

- **Autentikasi GitHub**: Pengguna dapat masuk dan keluar menggunakan akun GitHub.
- **Feed Postingan**: Lihat daftar postingan terbaru dari seluruh komunitas.
- **Buat Postingan**: Pengguna yang sudah login dapat membuat postingan baru dengan teks dan gambar (opsional).
- **Like & Komentar**: Setiap postingan dapat diberi like dan dikomentari oleh pengguna lain.
- **Komentar Bersarang**: Komentar mendukung balasan (nested reply) hingga 3 tingkat.
- **UI Responsif**: Tampilan modern dan responsif, optimal untuk desktop maupun mobile.

## Teknologi yang Digunakan

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tool)
- [Supabase](https://supabase.com/) (database, storage, dan autentikasi)
- [TailwindCSS](https://tailwindcss.com/) (utility-first CSS)
- [React Query](https://tanstack.com/query/latest) (data fetching & caching)
- [React Router](https://reactrouter.com/) (routing)

## Cara Menjalankan Project

1. **Clone repository:**
   ```bash
   git clone <repo-url>
   cd lingkar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Konfigurasi Supabase:**
   - Buat project di [Supabase](https://app.supabase.com/).
   - Buat file `.env` di root project dan tambahkan:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_KEY=your_supabase_anon_key
     ```
   - Pastikan storage bucket `post-images` sudah dibuat di Supabase Storage.

4. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```

5. **Akses di browser:**
   ```
   http://localhost:5173
   ```

## Struktur Halaman

- **Home** (`/`): Feed postingan, tombol buat postingan, daftar postingan.
- **Post Detail** (`/post/:id`): Detail postingan, komentar, balas komentar.
- **Create Post** (`/create`): Form untuk membuat postingan baru.

## Autentikasi

- Hanya pengguna yang login (GitHub OAuth) yang dapat membuat postingan, memberi like, dan berkomentar.
- Logout dan login dapat diakses dari menu profil.

## Kontribusi

Kontribusi sangat terbuka! Silakan fork repo ini, buat branch baru, dan ajukan pull request.

## Lisensi

MIT
