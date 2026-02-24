# Roadmap Pengerjaan: Taskly — To-Do List Neobrutalism

Roadmap ini dibagi menjadi **3 tahap utama** agar setiap fase bisa dikerjakan secara mandiri dan fokus. Tahap Frontend dibreakdown secara mendalam karena menjadi pondasi pengalaman pengguna.

---

## Tahap 1: Frontend (Antarmuka & Interaktivitas Penuh)
**Tujuan:** Membangun seluruh antarmuka, halaman, komponen, interaksi, dan state management secara lengkap menggunakan data lokal (*mock*). Saat tahap ini selesai, aplikasi harus **terasa hidup dan fungsional sepenuhnya** di sisi klien — hanya belum tersimpan di database.

### 1.1 — Fondasi & Design System ✅
> *Status: Selesai*
- [x] Inisiasi proyek Next.js (App Router) + Tailwind CSS v4
- [x] Design tokens Neobrutalism (palet warna, shadow, border, fonts)
- [x] Komponen primitif: `NeoButton`, `NeoInput`, `NeoCard`
- [x] Animasi dasar (fadeInUp, float, bounceIn, slideOut)
- [x] Custom checkbox Neobrutalism (`.neo-checkbox`)

### 1.2 — Halaman & Routing Lengkap ✅
- [x] **Landing Page** (`/`) — Hero, CTA, footer minimalis Neobrutalism
- [x] **Dashboard** (`/dashboard`) — Ringkasan hari ini, kartu tugas aktif/selesai, widget kalender
- [x] **Kanban Board** (`/dashboard/board`) — Papan drag-and-drop tugas interaktif dengan lebar responsif
- [x] **Daftar Kategori** (`/dashboard/categories`) — Manajemen label kustom
- [ ] **Halaman Login/Register** (`/login`, `/register`) — UI Autentikasi (segera di Tahap 2)
- [x] **Halaman 404 (Not Found)** (`not-found.tsx`) — Halaman error custom bergaya Neobrutalism
- [x] **Dashboard Layout** (`/dashboard/layout.tsx`) — Sidebar navigasi persisten, collapsible di desktop & overlay di mobile
- [x] **Loading & Error UI** — Skeleton dan fallback standar Next.js App Router

### 1.3 — Komponen Dashboard Lanjutan ✅
- [x] **Sidebar Navigasi** — Kolaps menjadi ikon-only di desktop (*justify-center*), merespons warna hover spesifik tiap menu
- [x] **Dashboard Summary & Progress** — Penghitung tugas Aktif/Selesai/Terlambat, bar persentase visual progres harian
- [x] **Toast Notification System** — Sistem notifikasi sukses/gagal bergaya pop-out komik, lengkap dengan fitur "Undo" (kembalikan aksi)
- [x] **Calendar Widget** — Menandai otomatis hari ini, merah untuk Minggu, hijau untuk Jumat, dan terintegrasi API Libur Nasional (latar pink + *tooltip* perayaan)

### 1.4 — Fitur Manajemen Tugas Lanjutan ✅
- [x] **Inline & Modal Task Forms** — Tambah tugas kilat lewat formulir *inline* atau pop-up Modal dengan *default deadline* hari ini
- [x] **Prioritas & Kategori** — Atribut warna prioritas (Rendah/Sedang/Tinggi) dan pemilihan label kategori 
- [x] **Pemberian Checklist Cepat** — Akses menyelesaikan tugas langsung lewat kotak centang tebal di Dashboard
- [x] **Drag & Drop (Kanban)** — Penataan kartu tugas lintas kolom (`dnd-kit`) dengan dukungan Undo saat dipindah ke "Selesai"
- [x] **Clear Completed** — Tombol hapus masal untuk tugas yang sudah selesai (*Trash* header icon di Kanban)

### 1.5 — UX Polish & Aksesibilitas ✅
- [x] **Murni Light Mode Neobrutalism** — Mengabaikan *dark mode* demi mempertahankan identitas keras dan kontras warna pastel/hitam pekat khas Neobrutalism
- [x] **Micro-interactions Polish** — Efek mentok/terdorong nyata saat *hover* tombol, bayangan kotak 3D (*hard drop shadow*) statis, serta *bouncy spring* di modal
- [x] **Fluid Layout** — Penyesuaian lebar kanban kolom ke *flex-grow* adaptif, menyebar membunuh ruang mati (*whitespace*)
- [x] **Aksesibilitas** — Kontras warna ramah mata, tulisan sans-serif proposional (Public Sans / Space Grotesk fallback)

### 1.6 — State Management & Data Layer (Mock) ✅
- [x] **Centralized Task Store (Zustand)** — Managemen state `useTaskStore` super efisien; akses fungsi mutasi lintar halaman
- [x] **Persistent Mock Data** — Integrasi middleware `persist` bawaan Zustand untuk merekam data ke `localStorage` (tahan *refresh*)
- [x] **Type Safety** — Implementasi ketat interface `Task`, `BoardList`, `Category`, `Priority` dalam ekosistem TypeScript

---

## Tahap 2: Backend (Supabase & Keamanan Data)
**Tujuan:** Menyiapkan seluruh infrastruktur data, autentikasi, dan keamanan di sisi server. Saat tahap ini selesai, semua tabel, *policy*, dan fungsi API sudah siap pakai — tinggal dihubungkan ke frontend.

### 2.1 — Setup Proyek Supabase
- [ ] Buat proyek baru di Supabase Dashboard
- [ ] Simpan environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) di `.env.local`
- [ ] Install `@supabase/supabase-js` dan `@supabase/ssr`
- [ ] Buat Supabase client utilities (`lib/supabase/client.ts`, `lib/supabase/server.ts`)

### 2.2 — Skema Database
- [ ] Tabel `profiles` (id, email, display_name, avatar_url, created_at)
- [ ] Tabel `categories` (id, user_id, name, color, created_at)
- [ ] Tabel `tasks` (id, user_id, category_id, title, description, priority, due_date, is_completed, position, created_at, updated_at)
- [ ] Foreign keys dan indexes yang tepat

### 2.3 — Row Level Security (RLS)
- [ ] Policy SELECT: user hanya bisa membaca data miliknya sendiri
- [ ] Policy INSERT: user hanya bisa menambah data dengan `user_id` = `auth.uid()`
- [ ] Policy UPDATE: user hanya bisa mengubah data miliknya sendiri
- [ ] Policy DELETE: user hanya bisa menghapus data miliknya sendiri

### 2.4 — Autentikasi Supabase
- [ ] Konfigurasi Supabase Auth (Email/Password sign-up)
- [ ] Konfigurasi OAuth provider (Google Sign-In opsional)
- [ ] Setup email confirmation flow & redirect URL
- [ ] Middleware Next.js untuk proteksi rute (`/dashboard/*`)

---

## Tahap 3: Integrasi Frontend ↔ Backend
**Tujuan:** Menggantikan seluruh data mock dan logika lokal dengan koneksi langsung ke Supabase. Saat tahap ini selesai, aplikasi sudah **production-ready** dan bisa di-*deploy* ke Vercel.

### 3.1 — Integrasi Autentikasi
- [ ] Hubungkan form Login/Register ke Supabase Auth
- [ ] Implementasi session management (cookies via `@supabase/ssr`)
- [ ] Protected routes via Next.js Middleware
- [ ] Redirect logic: belum login → `/login`, sudah login → `/dashboard`
- [ ] Tampilkan info user asli (nama, email) di `AppHeader`

### 3.2 — Integrasi CRUD Tugas
- [ ] Ganti mock `addTask()` → `supabase.from('tasks').insert()`
- [ ] Ganti mock `toggleTask()` → `supabase.from('tasks').update()`
- [ ] Ganti mock `deleteTask()` → `supabase.from('tasks').delete()`
- [ ] Ganti mock `editTask()` → `supabase.from('tasks').update()`
- [ ] Fetch tugas dari Supabase saat dashboard dimuat
- [ ] Implementasi Optimistic UI + rollback jika API gagal

### 3.3 — Integrasi Kategori & Fitur Lanjutan
- [ ] CRUD kategori via Supabase
- [ ] Sinkronisasi drag & drop position dengan database
- [ ] Pencarian server-side (opsional, jika data terlalu besar)

### 3.4 — Deployment & Quality Assurance
- [ ] Hubungkan repository GitHub ke Vercel
- [ ] Set environment variables di Vercel Dashboard
- [ ] Build test (`npm run build` harus sukses tanpa error)
- [ ] Konfigurasi Supabase redirect URLs untuk domain produksi
- [ ] Testing end-to-end: register → login → CRUD tugas → logout
- [ ] Optimasi performa (Lighthouse audit)
- [ ] Peluncuran ke publik 🚀
