import Link from "next/link";
import * as motion from "framer-motion/client";
import {
  Zap, Palette, Shield, Sparkles, ArrowRight,
  Columns3, CalendarDays, Tag, Clock, CheckCircle2,
  GripVertical, Plus, Trash2, UserPlus, LogIn, LayoutDashboard,
} from "lucide-react";
import NeoButton from "@/components/ui/NeoButton";
import LiveStats from "@/components/LiveStats";

// --- Mini preview components for feature cards ---
function BoardPreview() {
  return (
    <div className="flex gap-2 overflow-hidden mt-3 scale-[0.85] origin-top-left">
      {[
        { title: "Due Task", color: "bg-neo-red/30", items: ["Revisi laporan"] },
        { title: "To Do", color: "bg-neo-yellow", items: ["Setup server"] },
        { title: "Done", color: "bg-neo-green", items: ["Desain UI"] },
      ].map((col) => (
        <div key={col.title} className="w-24 flex-shrink-0 neo-border bg-neo-bg">
          <div className={`px-2 py-1 border-b-2 border-neo-black ${col.color}`}>
            <span className="font-heading text-[9px] font-bold">{col.title}</span>
          </div>
          <div className="p-1 space-y-1">
            {col.items.map((item) => (
              <div key={item} className="flex items-center gap-1 p-1 neo-border bg-neo-white text-[8px] font-sans">
                <GripVertical size={6} className="text-neo-black/20" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="mt-3 space-y-2 scale-[0.85] origin-top-left">
      <div className="flex gap-2">
        <div className="px-2 py-1.5 neo-border bg-neo-yellow text-center flex-1">
          <p className="font-heading text-sm font-bold">3</p>
          <p className="text-[7px] font-bold">AKTIF</p>
        </div>
        <div className="px-2 py-1.5 neo-border bg-neo-green text-center flex-1">
          <p className="font-heading text-sm font-bold">5</p>
          <p className="text-[7px] font-bold">SELESAI</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 p-1.5 neo-border bg-neo-white">
        <div className="w-2 h-2 neo-border border-[1.5px]" />
        <div className="w-0.5 h-4 bg-neo-red flex-shrink-0" />
        <span className="text-[8px] font-sans truncate">Selesaikan deadline</span>
        <span className="ml-auto text-[7px] px-1 py-0.5 neo-border bg-neo-red font-bold">Tinggi</span>
      </div>
    </div>
  );
}

function KategoriPreview() {
  return (
    <div className="flex flex-wrap gap-2 mt-3 scale-[0.85] origin-top-left">
      <div className="px-2 py-1 text-[8px] font-bold font-heading neo-border bg-neo-cyan flex items-center gap-1">
        <Tag size={8} /> Kerja
      </div>
      <div className="px-2 py-1 text-[8px] font-bold font-heading neo-border bg-neo-pink flex items-center gap-1">
        <Tag size={8} /> Pribadi
      </div>
      <div className="px-2 py-1 text-[8px] font-bold font-heading neo-border bg-neo-yellow flex items-center gap-1">
        <Tag size={8} /> Belajar
      </div>
      <div className="px-2 py-1 text-[8px] font-bold font-heading neo-border border-dashed bg-neo-white flex items-center gap-1 text-neo-black/40">
        <Plus size={8} /> Kategori Baru
      </div>
    </div>
  );
}

function DeadlinePreview() {
  return (
    <div className="mt-3 scale-[0.85] origin-top-left neo-border bg-neo-white p-2 w-48">
      <div className="flex justify-between items-center mb-2">
        <span className="font-heading text-[9px] font-bold">Februari 2026</span>
        <CalendarDays size={10} />
      </div>
      <div className="grid grid-cols-7 gap-1 text-[7px] font-bold text-center text-neo-black/40">
        <span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span><span>M</span>
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1 text-[8px] text-center">
        <div className="py-0.5 text-neo-black/20">23</div>
        <div className="py-0.5 neo-border bg-neo-yellow font-bold">24</div>
        <div className="py-0.5 neo-border bg-neo-pink font-bold relative">
          25<div className="absolute -top-1 -right-1 w-2 h-2 bg-neo-red neo-border border-[1px]" />
        </div>
        <div className="py-0.5">26</div>
        <div className="py-0.5">27</div>
      </div>
    </div>
  );
}

function OverduePreview() {
  return (
    <div className="mt-3 scale-[0.85] origin-top-left flex flex-col gap-2">
      <div className="flex items-center gap-2 p-1.5 neo-border bg-neo-white opacity-50 relative">
        <div className="absolute -right-2 -top-2 px-1 py-0.5 bg-neo-red text-neo-white font-bold text-[6px] neo-border rotate-12">OVERDUE!</div>
        <div className="w-2 h-2 neo-border border-[1.5px] border-neo-black/50" />
        <span className="text-[9px] font-sans line-through decoration-neo-red decoration-2">Kumpul revisi</span>
      </div>
      <div className="flex items-center gap-2 p-1.5 neo-border bg-neo-red/20 shadow-[2px_2px_0_0_#e0e0e0]">
        <Clock size={12} className="text-neo-red animate-pulse" />
        <div className="flex flex-col">
          <span className="text-[9px] font-bold font-sans">Presentasi Client</span>
          <span className="text-[7px] text-neo-red font-bold">-2 Hari Terlambat</span>
        </div>
      </div>
    </div>
  );
}

function UndoPreview() {
  return (
    <div className="mt-3 scale-[0.85] origin-top-left flex flex-col gap-2">
      <div className="flex items-center gap-2 px-2 py-1.5 neo-border bg-neo-green w-48 shadow-[2px_2px_0_0_#2a2a3e]">
        <CheckCircle2 size={12} strokeWidth={3} className="text-neo-black" />
        <span className="text-[8px] font-bold">1 tugas berhasil dihapus</span>
        <button className="ml-auto bg-neo-white px-2 py-0.5 text-[7px] font-black neo-border border-[1.5px] hover:bg-neo-yellow active:translate-y-px">UNDO</button>
      </div>
      <div className="flex items-center gap-2 px-2 py-1.5 neo-border bg-neo-white border-dashed text-neo-black/30 w-48">
        <Trash2 size={10} strokeWidth={2} />
        <span className="text-[8px] font-bold italic line-through">Draft presentasi lama</span>
      </div>
    </div>
  );
}


// --- Feature data ---
const features = [
  {
    icon: Columns3,
    title: "Kanban Board",
    desc: "Drag & drop tugas antar kolom. Lihat mana yang overdue, ongoing, atau sudah beres!",
    color: "bg-neo-cyan",
    preview: <BoardPreview />,
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Pintar",
    desc: "Rangkuman harian: tugas aktif, progress bar, kalender deadline — semua di satu layar.",
    color: "bg-neo-yellow",
    preview: <DashboardPreview />,
  },
  {
    icon: Tag,
    title: "Kategori Custom",
    desc: "Buat, edit, hapus kategori semaumu. Warnai sesuai mood — Kerja, Belajar, Olahraga, apapun!",
    color: "bg-neo-pink",
    preview: <KategoriPreview />,
  },
  {
    icon: CalendarDays,
    title: "Deadline Tracker",
    desc: "Set deadline, lihat di kalender, terima peringatan ketika tugas lewat batas waktu.",
    color: "bg-neo-green",
    preview: <DeadlinePreview />,
  },
  {
    icon: Clock,
    title: "Deteksi Overdue",
    desc: "Tugas yang lewat deadline otomatis muncul di kolom 'Due Task' berwarna merah. Tidak bisa kabur!",
    color: "bg-neo-orange",
    preview: <OverduePreview />,
  },
  {
    icon: CheckCircle2,
    title: "Undo & Aman",
    desc: "Salah hapus? Tenang, ada tombol Undo. Semua tersimpan otomatis di browser kamu.",
    color: "bg-neo-bg",
    preview: <UndoPreview />,
  },
];

// --- Tutorial steps ---
const tutorialSteps = [
  { step: 1, icon: UserPlus, title: "Daftar Akun", desc: "Buat akun baru dengan nama dan email. Gratis, tanpa ribet!", color: "bg-neo-cyan" },
  { step: 2, icon: LogIn, title: "Masuk ke Dashboard", desc: "Login, dan kamu langsung disambut dashboard yang rapi dan informatif.", color: "bg-neo-yellow" },
  { step: 3, icon: Plus, title: "Tambah Tugas", desc: "Klik tombol 'Tambah', isi judul, set prioritas dan deadline. Selesai!", color: "bg-neo-pink" },
  { step: 4, icon: Columns3, title: "Kelola di Board", desc: "Drag tugas antar kolom: To Do, Due Task, Done. Semudah main puzzle!", color: "bg-neo-green" },
  { step: 5, icon: Trash2, title: "Bersihkan yang Selesai", desc: "Tugas selesai? Hapus semua sekaligus. Kalau salah, tinggal Undo.", color: "bg-neo-orange" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neo-bg overflow-hidden relative">
      {/* Decorative floating blocks */}
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-20 left-10 w-16 h-16 bg-neo-yellow neo-border neo-shadow opacity-60 hidden md:block" />
      <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute top-40 right-16 w-12 h-12 bg-neo-cyan neo-border neo-shadow opacity-60 hidden md:block" />
      <motion.div animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }} className="absolute bottom-32 left-1/4 w-20 h-20 bg-neo-pink neo-border neo-shadow opacity-50 hidden md:block" />

      {/* Hero Section */}
      <header className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] pb-20 pt-28 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-neo-yellow neo-border neo-shadow-sm font-heading font-bold text-sm tracking-wider uppercase">
            <Sparkles size={16} strokeWidth={2.5} /> Personal Task Manager
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-neo-black mb-6">
          Taskly<span className="text-neo-pink">.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="font-sans text-lg sm:text-xl md:text-2xl text-neo-black/70 max-w-xl mb-4">
          Kelola tugasmu dengan cara yang{" "}
          <span className="font-bold bg-neo-cyan px-1 text-neo-black">menyenangkan</span> dan{" "}
          <span className="font-bold bg-neo-pink px-1 text-neo-black">terorganisir</span>.
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="font-sans text-base text-neo-black/50 max-w-md mb-10">
          Desain neobrutalis yang playful. Tanpa ribet, langsung produktif. Drag, drop, done!
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Link href="/auth">
            <NeoButton variant="yellow" className="text-lg px-10 py-4 hover:scale-105 transition-transform duration-200">
              Mulai Sekarang <ArrowRight size={20} className="ml-2 inline group-hover:translate-x-1 transition-transform" />
            </NeoButton>
          </Link>
        </motion.div>

        {/* Quick stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-16 flex flex-wrap justify-center gap-4">
          {[
            { label: "Super Cepat", icon: Zap, color: "bg-neo-yellow" },
            { label: "Fun & Playful", icon: Palette, color: "bg-neo-cyan" },
            { label: "Aman & Privat", icon: Shield, color: "bg-neo-pink" },
          ].map((item) => (
            <div key={item.label} className={`p-4 ${item.color} neo-border neo-shadow-sm text-center transform transition-transform hover:-translate-y-1 hover:shadow-lg w-32`}>
              <item.icon size={24} strokeWidth={2.5} className="mx-auto mb-2 text-neo-black" />
              <p className="font-heading font-bold text-xs">{item.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Live User Counter */}
        <LiveStats />
      </header>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24 bg-neo-white border-y-[3px] border-neo-black overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-neo-black mb-4">
              Fitur yang Bikin <span className="bg-neo-cyan px-2 inline-block -rotate-2 transform">Ketagihan</span>
            </h2>
            <p className="font-sans text-base text-neo-black/50 max-w-lg mx-auto">
              Bukan cuma to-do list biasa. Taskly punya semua yang kamu butuhkan untuk jadi produktif — dengan gaya!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`flex flex-col p-6 neo-border neo-shadow-sm ${f.color} transition-all duration-300 hover:shadow-[6px_6px_0px_0px_var(--neo-black)] group`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-neo-white/50 neo-border rounded-none group-hover:bg-neo-white transition-colors">
                    <f.icon size={24} strokeWidth={2.5} className="text-neo-black" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-neo-black leading-tight">{f.title}</h3>
                </div>
                <p className="font-sans text-sm text-neo-black/80 leading-relaxed flex-1">{f.desc}</p>

                {/* Visual Preview Container */}
                <div className="mt-4 pt-4 border-t-2 border-neo-black/10 overflow-hidden relative">
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[var(--neo-bg)] to-transparent z-10 mix-blend-overlay" />
                  {f.preview}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorial Section */}
      <section className="relative z-10 px-6 py-24 bg-neo-bg">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-neo-black mb-4">
              Mulai dalam <span className="bg-neo-pink px-2 inline-block -rotate-1">5 Langkah</span>
            </h2>
            <p className="font-sans text-base text-neo-black/50 max-w-lg mx-auto">
              Dari daftar sampai kelola tugas — semudah ABC. Ikuti panduan singkat ini!
            </p>
          </motion.div>

          <div className="space-y-4">
            {tutorialSteps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ x: 10, transition: { duration: 0.2 } }}
                className={`flex items-start gap-4 p-5 neo-border neo-shadow-sm ${s.color} transition-transform`}
              >
                <div className="w-12 h-12 flex items-center justify-center neo-border bg-neo-white font-heading font-black text-2xl flex-shrink-0 relative overflow-hidden group">
                  <span className="relative z-10">{s.step}</span>
                  <div className="absolute inset-0 bg-neo-yellow translate-y-full transition-transform group-hover:translate-y-0" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon size={20} strokeWidth={3} className="text-neo-black" />
                    <h3 className="font-heading font-bold text-xl text-neo-black">{s.title}</h3>
                  </div>
                  <p className="font-sans text-base text-neo-black/70">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center mt-16">
            <Link href="/auth">
              <NeoButton variant="yellow" className="text-xl px-12 py-5 shadow-[4px_4px_0px_0px_var(--neo-black)] hover:shadow-[6px_6px_0px_0px_var(--neo-black)] hover:-translate-y-1 hover:-translate-x-1">
                Cobain Sekarang, Gratis! <ArrowRight size={24} strokeWidth={3} className="ml-2 inline animate-pulse" />
              </NeoButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 bg-neo-white text-center border-t-[3px] border-neo-black">
        <p className="font-sans text-xs text-neo-black/60 font-bold">
          Dibuat oleh <span className="text-neo-black bg-neo-yellow px-1 underline decoration-neo-pink decoration-2">Muhammad Ali Ridho</span> &mdash; Taskly<span className="text-neo-pink">.</span> v1.0
        </p>
      </footer>
    </div>
  );
}
