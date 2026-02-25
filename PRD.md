# Product Requirements Document (PRD): Personal To-Do List App

## 1. Ringkasan Eksekutif (Executive Summary)
Proyek ini bertujuan untuk membangun sebuah aplikasi manajemen tugas (to-do list) pribadi yang *full-stack*, interaktif, dan aman. Mengusung gaya desain **Neobrutalism** yang *fun* dan *playful*, aplikasi ini tidak hanya berfokus pada estetika yang berani dan mencolok (seperti Logo SVG kustom dan warna solid), tetapi juga mempertahankan standar tinggi terhadap kenyamanan pengguna (User Comfort) serta aksesibilitas.

## 2. Tech Stack (Teknologi yang Digunakan)
Aplikasi ini dikembangkan dengan pendekatan modern (*Modern Web Architecture*):
*   **Frontend (Antarmuka):** Next.js (React) App Router dipadukan dengan Tailwind CSS untuk arsitektur ringan dan styling utilitas yang cepat.
*   **Database & BaaS (Backend as a Service):** Supabase (PostgreSQL, Autentikasi OAuth SSR, *Row Level Security*, dan Supabase Realtime).
*   **Hosting & Deployment:** Vercel (CI/CD terintegrasi dengan custom domain `taskly.muhammadaliridho.my.id`).
*   **Version Control:** GitHub.

## 3. Alur Pengguna (User Flow)
Fokus utama adalah meminimalisir langkah namun memaksimalkan interaksi yang menyenangkan.

**A. Fase Onboarding & Autentikasi**
1.  **Landing Page:** Menampilkan penjelasan singkat dengan desain Neobrutalism, dilengkapi Logo "T" kustom SVG bergaris tebal, serta tombol *Call to Action* (CTA).
2.  **Autentikasi:** Mendaftar atau masuk menggunakan Email/Password, atau melalui **Google OAuth** (dioptimalkan dengan **PKCE flow** via middleware server-side untuk keamanan ekstra di production). Terdapat juga alur Lupa Password / Reset Password.
3.  **Redirecting:** Segera setelah sistem memverifikasi kredensial di middleware, pengguna dialihkan dengan mulus ke Dashboard.

**B. Pengelolaan Tugas (Dashboard Utama)**
1.  **Tinjauan Utama:** Pengguna disapa dengan *greeting* dinamis dan dapat melihat **Live User Counter** (menunjukkan pengguna aktif saat ini secara *real-time*).
2.  **Scorecard Interaktif:** Menampilkan metrik tugas "Selesai", "Aktif", dan **"Terlambat" (Overdue)**. Kartu Terlambat akan berdenyut (animasi *pulse* merah) jika ada tugas yang melewati tenggat waktu.
3.  **Penambahan Instan:** Pengguna mengetik tugas pada kolom *input*, memilih kategori/label, mengatur tenggat waktu (*DueDate*), lalu menekan 'Enter'.
4.  **Tampilan Fleksibel:** Pengguna dapat berpindah antara tampilan **List** tradisional dan **Board (Kanban)** untuk memindahkan tugas antar status (Todo, In Progress, Done).
5.  **Aksi Tugas:** Menyelesaikan, mengedit (*inline focus*), dan menghapus tugas dengan animasi *pop-out* dan notifikasi toast keberhasilan.

**C. Navigasi & Organisasi**
1.  **Sidebar Navigasi:** Menu samping (Desktop) dan menu *hamburger* bawah/atas (Mobile) yang responsif, menyajikan akses ke Dashboard, Agenda (Kalender), Kategori, dan Board.
2.  **Filter & Pencarian:** Bilah telusur berbingkai hitam tegas untuk mencari tugas spesifik dengan instan.

## 4. Fitur-Fitur Utama (Key Features)
*   **Autentikasi & Proteksi Rute Tingkat Lanjut:** Middleware Next.js secara aktif melindungi halaman internal dan menangani *cookie routing* sesi Supabase.
*   **Manajemen Tugas Lanjutan:** Dukungan *Due Date*, Kategori/Label dinamis, dan prioritas.
*   **Kanban Board View:** Pengelompokan visual tugas berdasarkan status.
*   **Live User Presence:** Indikator jumlah pengguna yang sedang online menggunakan kapabilitas Realtime Supabase.
*   **Umpan Balik Instan (Toast Notifications):** Notifikasi *pop-out* bergaya komik yang seru di pojok layar untuk setiap aksi sukses/gagal.
*   **Empty States Interaktif:** Menampilkan corat-coretan (*doodles*) seru saat daftar tugas belum ada.

## 5. Pendekatan Estetika & Kenyamanan Pengguna (UI/UX)
Mengawinkan desain **Neobrutalism** dengan kenyamanan absolut terinspirasi praktik terbaik industri.

### A. Prinsip UI Visual (Neobrutalism yang Playful)
*   **Garis Tepi & Blok Warna Mentah:** Elemen antarmuka (kartu, tombol, input, **Logo SVG**, dan **Favicon**) dibatasi garis hitam tebal (`border-2 border-black`).
*   **Shadow Padat (Hard Drop Shadows):** Bayangan hitam pekat di bawah elemen yang memberikan kesan 3D pop-up (`shadow-[4px_4px_0px_#000]`).
*   **Warna "Fun" Kontras Tinggi:** Menggunakan warna *neo-yellow*, *neo-pink*, *neo-cyan*, *neo-red*, dan *neo-green* dengan latar *off-white* untuk visibilitas maksimal.
*   **Tipografi Tegas:** *Font* `Space Grotesk` untuk *heading* yang mencolok dan `Inter` untuk kemudahan membaca teks deskripsi.

### B. Prinsip UX & Aksesibilitas (Responsivitas Penuh)
*   **Aksesibilitas Ekstra (Screen Readers):** Menggunakan utilitas `sr-only` dan semantik HTML5 yang tepat.
*   **Mobile-First Responsive Design:** Header, sidebar, username (menggunakan `flex-wrap` dan `max-w`), dan grid tugas dioptimalkan khusus agar tidak *overflow* di layar kecil ponsel. Favicon dikonfigurasi eksplisit (`apple-touch-icon`) untuk PWA / *homescreen*.
*   **Kenyamanan Terjaga:** Mempertahankan rasio kontras warna standar WCAG, tidak agresif di mata. Tersedia sakelar **Dark Mode** (*neo-dark*) opsional.

## 6. Komponen Kunci Aplikasi (Key Components)
*   `Sidebar` & `AppHeader`: Bilah navigasi dengan logo kustom "Taskly", terintegrasi tombol *Quick Add* tugas dan *Theme Toggle*.
*   `DashboardClient`: Komponen orkestrasi beranda yang memegang statika *scorecards*, *username* responsif, salam pintar (*greeting*), dan komponen daftar tugas.
*   `TaskBoard` & `TaskList`: Komponen penyajian list VS grid/board bergaya Neobrutalist.
*   `AuthContainer`: Formulir estetis berupa kotak bertumpuk untuk login/registrasi dan koneksi Google OAuth.

## 7. Skalabilitas & Keamanan (Scalability & Security)
Tetap menggunakan prinsip arsitektur mapan di balik fasad desain cerianya.
*   **Kecerdasan Arsitektur Data (Supabase):** Database PostgreSQL relasional dipadukan API Otomatis yang aman.
*   **Keamanan Eksekusi Sesi (PKCE Middleware):** Token OAuth di-tukar (*exchange*) secara solid di layer middleware `/` maupun `/auth/callback` agar flow sesi konsisten dan *tamper-proof*.
*   **Row Level Security (RLS) Supabase:** Membatasi akses mutlak sehingga pengguna hanya bisa membaca/menulis data milik mereka sendiri berdasarkan `auth.uid()`. Password yang bocor dicek via parameter keamanan Supabase.
