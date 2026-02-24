# Product Requirements Document (PRD): Personal To-Do List App

## 1. Ringkasan Eksekutif (Executive Summary)
Proyek ini bertujuan untuk membangun sebuah aplikasi manajemen tugas (to-do list) pribadi yang *full-stack*, interaktif, dan aman. Mengusung gaya desain **Neobrutalism** yang *fun* dan *playful*, aplikasi ini tidak hanya berfokus pada estetika yang berani dan mencolok, tetapi juga mempertahankan standar tinggi terhadap kenyamanan pengguna (User Comfort) serta aksesibilitas.

## 2. Tech Stack (Teknologi yang Digunakan)
Aplikasi ini dikembangkan dengan pendekatan modern (*Modern Web Architecture*):
*   **Frontend (Antarmuka):** Next.js (React) dipadukan dengan Tailwind CSS untuk arsitektur ringan dan styling utilitas yang cepat. *(Pengembangan dibantu oleh AI Antigravity)*.
*   **Database & BaaS (Backend as a Service):** Supabase (memanfaatkan arsitektur PostgreSQL, sistem autentikasi bawaan, dan *Row Level Security*).
*   **Hosting & Deployment:** Vercel (CI/CD terintegrasi, *global edge network*).
*   **Version Control:** GitHub.

## 3. Alur Pengguna (User Flow)
Fokus utama adalah meminimalisir langkah namun memaksimalkan interaksi yang menyenangkan.

**A. Fase Onboarding & Autentikasi**
1.  **Landing Page:** Pengguna mengunjungi halaman utama yang menampilkan penjelasan singkat dengan desain Neobrutalism (warna kontras, tipe tebal, bayangan solid/keras), serta tombol *Call to Action* (CTA) yang bergeser kejut saat di-*hover*.
2.  **Autentikasi:** Mendaftar atau masuk dengan aman menggunakan Email/Password, atau melalui otentikasi pihak ketiga yang disediakan Supabase.
3.  **Redirecting:** Segera setelah sistem memverifikasi kredensial, pengguna dialihkan ke Dashboard Papan Tugas.

**B. Pengelolaan Tugas (Dashboard Utama)**
1.  **Tinjauan Utama:** Pengguna melihat daftar tugas yang menyerupai *post-it notes* digital atau blok warna-warni bergaris hitam tegas.
2.  **Penambahan Instan:** Pengguna mengetik tugas pada kolom *input* yang dinamis dan menekan 'Enter'. Tugas baru muncul dengan animasi memantul (*bouncy spring*).
3.  **Aksi Tugas:** 
    *   **Menyelesaikan:** Menekan *checkbox* tebal. Judul tugas akan tercoret garis bawah tebal dan berpindah secara perlahan.
    *   **Mengedit:** Mengklik teks tugas akan memunculkan kursor kedap-kedip (input fokus) bergaya retro untuk mengedit langsung di tempat.
    *   **Menghapus:** Menekan ikon "X" besar untuk meledakkan/membersihkan tugas (animasi meletus riang).

**C. Navigasi & Organisasi**
1.  **Tab Filter:** Filter berbentuk tombol kotak-kotak besar yang seolah bisa ditekan masuk (seperti tombol mekanik) untuk berpindah antara: *Semua Tugas*, *Tugas Aktif*, dan *Tugas Selesai*.
2.  **Pencarian (Opsional):** Bilah telusur berbingkai hitam dan *placeholder* teks "Cari apa nih...?".

## 4. Fitur-Fitur Utama (Key Features)
*   **Sistem Autentikasi Solid:** Proteksi rute penuh (*Protected Routes*). 
*   **Manajemen Tugas (CRUD):** Tambahkan, baca, perbarui, dan hapus tugas secara seketika.
*   **Filter & Kategorisasi Status:** Pengelompokan tugas untuk menjaga layar tetap teratur.
*   **Umpan Balik Instan (Toast Notifications):** Notifikasi *pop-out* bergaya komik yang seru di pojok layar (misal: "Mantap! Tugas selesai 🎉").
*   **Empty States Interaktif:** Menampilkan corat-coretan (*doodles*) seru saat daftar tugas belum ada untuk memancing interaksi pengguna.

## 5. Pendekatan Estetika & Kenyamanan Pengguna (UI/UX)
Mengawinkan desain **Neobrutalism** dengan kenyamanan absolut terinspirasi praktik terbaik industri.

### A. Prinsip UI Visual (Neobrutalism yang Playful)
*   **Garis Tepi & Blok Warna Mentah:** Elemen antarmuka (kartu, tombol, input) dibatasi garis hitam tebal (`border-2 border-black` di Tailwind) yang meyakinkan.
*   **Shadow Padat (Hard Drop Shadows):** Bayangan tidak dikaburkan (*blur*) melainkan blok warna hitam pekat di bawah elemen yang memberikan kesan 3D pop-up (contoh Tailwind: `shadow-[4px_4px_0px_#000]`).
*   **Warna "Fun" Kontras Tinggi:** Menggunakan warna pastel mencolok seperti kuning kenari, *cyan*, magenta pudar, pink *bubblegum*, dan hijau lumut cerah—tapi dengan latar *off-white* untuk menjaga kejelasan teks.
*   **Tipografi Tegas:** *Font* bergaya *sans-serif* tebal (seperti Public Sans atau Space Grotesk) untuk judul, namun diimbangi dengan *font sans* berukuran proporsional yang sangat terbaca untuk konten tugas.

### B. Prinsip UX & Aksesibilitas (Best Practice dari Context7 / Dokumentasi Web)
*   **Aksesibilitas Ekstra (Screen Readers):** Menggunakan utilitas `sr-only` dan `not-sr-only` dari Tailwind CSS (sesuai best practice HTML) untuk menyembunyikan label panjang/dekoratif secara visual tanpa mengurangi fungsionalitas bagi pengguna *screen reader*.
*   **Mobile-First Responsive Design:** Memanfaatkan fitur bawaan Tailwind (prefiks `sm:`, `md:`, `lg:`) untuk menyesuaikan struktur Neobrutalism ke ukuran ponsel (misal, merapikan kartu agar menumpuk rapi di layar kecil dan menyebar leluasa di monitor raksasa).
*   **Kenyamanan Terjaga (User Comfort Override):** Tidak semua layar akan disesaki garis hitam dan warna terang. Kami mempertahankan rasio kontras warna standar WCAG (tulisan hitam pada terang, hindari warna menyilaukan), serta menyediakan ruang bernapas (*ample whitespace/padding*) antar elemen UI agar tidak memusingkan atau memicu kelelahan mata.
*   **Micro-Interactions yang Ringan:** Walaupun temanya bergaya "kasar/"brutal", transisi hover, input fokus, serta *clicking state* (`transform translate-y-1 shadow-none`) dibuat sangat tajam dan responsif, memberi sensasi "bermain klik".

## 6. Komponen Kunci Aplikasi (Key Components)
*   `AppHeader`: Bilah atas dengan logo/nama font besar dan warna dasar mencolok, dilengkapi sapaan santai.
*   `TaskInputField`: Blok *input* besar dengan border hitam, *focus outline* yang jelas untuk visibilitas, dipandu dengan tombol "Tambah" bercorak Neobrutalist mekanik.
*   `TaskList`: Kontainer tugas yang dinamis.
*   `TaskItemCard`: Tugas satuan dengan gaya kubus/kartu yang bereaksi (*hover & active states*) setiap kursormu lewat atau menekannya.
*   `AuthContainer`: Formulir estetis berupa kotak bertumpuk (*stacking boxes*) untuk login/registrasi.

## 7. Skalabilitas & Keamanan (Scalability & Security)
Tetap menggunakan prinsip arsitektur mapan di balik fasad desain cerianya.
*   **Kecerdasan Arsitektur Data (Supabase):** Database *relational* PostgreSQL mampu merespons laju data cepat tanpa henti.
*   **Caching Skala Edge (Vercel):** *Routing* diproses di-*edge network* lokal untuk memangkas *load times*.
*   **Row Level Security (RLS) Supabase:** Membatasi secara brutal (!) bahwa tidak ada klien manapun yang bisa melihat daftar tugas selain miliknya.
*   **Enkripsi Sesi:** Seluruh sesi ditangani aman dengan token persisten berbatas waktu.
