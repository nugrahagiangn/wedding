import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, Unlock, Sliders, Trash2, Copy, Check, Share2, Search, Users, 
  CheckCircle, HelpCircle, XCircle, Music, Volume2, Save, FileText, 
  ExternalLink, Key, RefreshCw, X, Download 
} from "lucide-react";
import { GuestbookEntry } from "../types";

interface AdminPanelProps {
  onClose: () => void;
  onMusicChanged: (newUrl: string, newTitle: string) => void;
  currentSongUrl: string;
  currentSongTitle: string;
  onRefreshData?: () => void;
}

export default function AdminPanel({ 
  onClose, 
  onMusicChanged, 
  currentSongUrl, 
  currentSongTitle,
  onRefreshData 
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Data State
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRsvp, setFilterRsvp] = useState<string>("all"); // all, hadir, ragu, absen
  
  // Music config state
  const [songUrl, setSongUrl] = useState(currentSongUrl);
  const [songTitle, setSongTitle] = useState(currentSongTitle);
  const [musicSaving, setMusicSaving] = useState(false);
  const [musicSuccess, setMusicSuccess] = useState(false);
  const [testPlaying, setTestPlaying] = useState(false);
  const [testAudio, setTestAudio] = useState<HTMLAudioElement | null>(null);

  // Local song download states
  const [downloadProgress, setDownloadProgress] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  // Local song upload states (from user device)
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadDragging, setUploadDragging] = useState(false);

  // Invitation Link Generator state
  const [guestName, setGuestName] = useState("");
  const [relation, setRelation] = useState("Teman");
  const [templateIndex, setTemplateIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWA, setCopiedWA] = useState(false);

  // Preset background songs list
  const musicPresets = [
    {
      title: "Bruno Mars - Risk It All",
      url: "brunomars.mp3"
    },
    {
      title: "Bruno Mars - Just The Way You Are",
      url: "https://archive.org/download/bruno-mars-all-songs/01%20-%20Just%20The%20Way%20You%20Are.mp3"
    },
    {
      title: "Bruno Mars - Marry You",
      url: "https://archive.org/download/bruno-mars-all-songs/03%20-%20Marry%20You.mp3"
    },
    {
      title: "Beautiful Wedding Piano (Royalty Free Preset)",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      title: "Soft Acoustic Guitar Romance (Royalty Free Preset)",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    }
  ];

  // Templates for WhatsApp invite messages in Indonesia
  const messageTemplates = [
    {
      name: "Formal Muslim (Akad & Resepsi)",
      text: (name: string, url: string) => 
`Assalamu'alaikum Wr. Wb.

Yth. *${name}*,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri dan memberikan doa restu pada hari bahagia pernikahan kami, Gian & Cucu.

Berikut adalah detail undangan digital kami:
🔗 ${url}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari istimewa kami.

Terima kasih atas perhatiannya.
Wassalamu'alaikum Wr. Wb.
— Gian & Cucu`
    },
    {
      name: "Formal Umum (Nasional/Internasional)",
      text: (name: string, url: string) => 
`Kepada Yth. Bapak/Ibu/Saudara/i *${name}*,

Dengan penuh rasa hormat dan kebahagiaan, kami mengundang Anda untuk menghadiri perayaan pernikahan kami, Gian Nugraha & Cucu Rohimas.

Detail informasi acara serta konfirmasi RSVP dapat Anda klik melalui tautan undangan digital di bawah ini:
🔗 ${url}

Kehadiran serta doa restu Anda di hari bahagia kami akan sangat melengkapi momen sakral ini.

Salam hangat penuh kasih,
— Gian & Cucu`
    },
    {
      name: "Krabat Dekat / Sahabat (Casual)",
      text: (name: string, url: string) => 
`Halo *${name}*!

Semoga kabar sehat selalu ya. Nggak terasa hari pernikahan aku & pasangan udah dekat. Tanpa mengurangi rasa hormat, melalui pesan ini kami mengundang kamu untuk hadir dan merayakan hari bahagia kami.

Yuk check tautan undangan digital resmi kami di bawah ini untuk melihat jadwal & lokasi pesta:
🔗 ${url}

Oya, kamu juga bisa tulis doa/ucapan serta isi konfirmasi kedatangan di bagian Buku Tamu / RSVP websitenya ya!

Sampai ketemu di pesta nanti!
— Gian & Cucu`
    }
  ];

  // Fetch guestbook list
  const fetchGuestbook = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/guestbook");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
        localStorage.setItem("invitation_guestbook", JSON.stringify(data));
      } else {
        throw new Error("Backend non-OK status");
      }
    } catch (err) {
      console.warn("Gagal memuat daftar tamu dari backend, menggunakan localStorage:", err);
      const stored = localStorage.getItem("invitation_guestbook");
      if (stored) {
        try {
          setEntries(JSON.parse(stored));
        } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchGuestbook();
    }
    return () => {
      if (testAudio) {
        testAudio.pause();
      }
    };
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple secure password: May 14, 2026 is Gian-Cucu wedding -> 140526, or "admin"
    if (passcode.trim() === "140526" || passcode.toLowerCase() === "admin") {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Kode PIN salah. Tips: Gunakan tanggal nikah pengantin (140526) atau kata sandi 'admin'.");
    }
  };

  const handleDeleteEntry = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ucapan dari "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/guestbook/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        // Remove locally
        setEntries(prev => prev.filter(entry => entry.id !== id));
        // Sync local storage
        const stored = localStorage.getItem("invitation_guestbook");
        if (stored) {
          try {
            const arr = JSON.parse(stored).filter((entry: any) => entry.id !== id);
            localStorage.setItem("invitation_guestbook", JSON.stringify(arr));
          } catch(e){}
        }
        if (onRefreshData) onRefreshData();
      } else {
        throw new Error("Gagal menghapus.");
      }
    } catch (err) {
      console.warn("Gagal menghapus via server, menghapus dari local storage:", err);
      const updated = entries.filter(entry => entry.id !== id);
      setEntries(updated);
      localStorage.setItem("invitation_guestbook", JSON.stringify(updated));
      if (onRefreshData) onRefreshData();
    }
  };

  const handleSaveMusic = async () => {
    if (!songUrl.trim() || !songTitle.trim()) {
      alert("Harap lengkapi URL dan judul lagu.");
      return;
    }

    setMusicSaving(true);
    setMusicSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeSongUrl: songUrl.trim(),
          activeSongTitle: songTitle.trim()
        })
      });

      if (res.ok) {
        setMusicSuccess(true);
        onMusicChanged(songUrl.trim(), songTitle.trim());
        setTimeout(() => setMusicSuccess(false), 4500);
      } else {
        throw new Error("Gagal menyimpan");
      }
    } catch (err) {
      console.warn("Masalah menyimpan musik via server, menyimpan di local storage:", err);
      const s = {
        activeSongUrl: songUrl.trim(),
        activeSongTitle: songTitle.trim()
      };
      localStorage.setItem("invitation_settings", JSON.stringify(s));
      setMusicSuccess(true);
      onMusicChanged(songUrl.trim(), songTitle.trim());
      setTimeout(() => setMusicSuccess(false), 4500);
    } finally {
      setMusicSaving(false);
    }
  };

  const handleDownloadMusic = async () => {
    const urlToDownload = songUrl.trim();
    const titleToSave = songTitle.trim();

    if (!urlToDownload || !titleToSave) {
      alert("Harap lengkapi URL dan judul lagu.");
      return;
    }

    if (urlToDownload === "/api/music.mp3") {
      alert("Lagu ini sudah tersimpan secara lokal di server aplikasi!");
      return;
    }

    setDownloadProgress(true);
    setDownloadError("");
    setDownloadSuccess(false);

    try {
      const res = await fetch("/api/download-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: urlToDownload,
          title: titleToSave
        })
      });

      if (res.ok) {
        setDownloadSuccess(true);
        setSongUrl("/api/music.mp3");
        setSongTitle(`${titleToSave} (Aplikasi Lokal)`);
        onMusicChanged("/api/music.mp3", `${titleToSave} (Aplikasi Lokal)`);
        if (onRefreshData) onRefreshData();
        setTimeout(() => setDownloadSuccess(false), 5000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setDownloadError(errorData.error || "Gagal mengunduh musik ke server.");
      }
    } catch (err) {
      console.error("Terjadi galat saat mengunduh lagu:", err);
      setDownloadError("Fitur unduh lokal butuh server aktif. Untuk GitHub Pages / statis, sila isi URL langsung lalu klik 'Gunakan URL' saja.");
    } finally {
      setDownloadProgress(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".mp3") && !file.type.startsWith("audio/")) {
      setUploadError("Harap pilih berkas audio berformat .mp3!");
      setUploadSuccess(false);
      return;
    }

    // Limit size to 15MB
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("Berkas terlalu besar! Maksimal ukuran berkas adalah 15MB.");
      setUploadSuccess(false);
      return;
    }

    setUploadProgress(true);
    setUploadError("");
    setUploadSuccess(false);

    // Get the name without the .mp3 suffix to display nicely in the title
    const cleanTitle = file.name.replace(/\.mp3$/i, "");

    try {
      const res = await fetch(`/api/upload-song?title=${encodeURIComponent(cleanTitle)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: file,
      });

      if (res.ok) {
        setUploadSuccess(true);
        setSongUrl("/api/music.mp3");
        setSongTitle(`${cleanTitle} (Hasil Unggah)`);
        onMusicChanged("/api/music.mp3", `${cleanTitle} (Hasil Unggah)`);
        if (onRefreshData) onRefreshData();
        setTimeout(() => setUploadSuccess(false), 5000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setUploadError(errorData.error || "Gagal mengunggah berkas musik.");
      }
    } catch (err) {
      console.error("Gagal mengunggah berkas:", err);
      setUploadError("Fitur unggah berkas butuh server aktif. Silahkan masukkan langsung link berkas internet yang valid di kolom lalu klik 'Gunakan URL'.");
    } finally {
      setUploadProgress(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragging(true);
  };

  const handleDragLeave = () => {
    setUploadDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };

  const triggerTestPlay = () => {
    if (testPlaying) {
      if (testAudio) {
        testAudio.pause();
      }
      setTestPlaying(false);
    } else {
      let resolvedUrl = songUrl;
      const isStaticHost = 
        window.location.hostname.endsWith(".github.io") || 
        window.location.hostname.includes("github.io") || 
        (!window.location.port && window.location.hostname !== "localhost");

      if (isStaticHost) {
        if (songUrl.startsWith("/api/music.mp3") || songUrl.includes("/api/music.mp3")) {
          resolvedUrl = "https://archive.org/download/bruno-mars-all-songs/01%20-%20Just%20The%20Way%20You%20Are.mp3";
        }
      }

      const newAudio = new Audio(resolvedUrl);
      newAudio.volume = 0.5;
      newAudio.play()
        .then(() => {
          setTestAudio(newAudio);
          setTestPlaying(true);
          newAudio.onended = () => setTestPlaying(false);
        })
        .catch(err => {
          alert("Gagal memutar audio preset ini. Mohon pastikan link berkas audio .mp3 valid dan mendukung CORS.");
        });
    }
  };

  // Dynamically constructed invite URL
  const getInviteUrl = () => {
    const origin = window.location.origin;
    if (!guestName.trim()) return origin;
    const cleanName = encodeURIComponent(guestName.trim());
    return `${origin}/wedding?to=${cleanName}`;
  };

  const getWaText = () => {
    const inviteUrl = getInviteUrl();
    const formattedName = guestName.trim() || "[Nama Tamu]";
    return messageTemplates[templateIndex].text(formattedName, inviteUrl);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getInviteUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyWAText = () => {
    navigator.clipboard.writeText(getWaText());
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2000);
  };

  const handleShareWa = () => {
    const text = encodeURIComponent(getWaText());
    const waUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(waUrl, "_blank");
  };

  // Calculate RSVPs stats
  const totalRsvpResponses = entries.length;
  const attendingGuests = entries.filter(e => e.rsvpHadir === "hadir").reduce((sum, current) => sum + current.countGuests, 0);
  const attendingCount = entries.filter(e => e.rsvpHadir === "hadir").length;
  const unsureCount = entries.filter(e => e.rsvpHadir === "ragu").length;
  const absentCount = entries.filter(e => e.rsvpHadir === "absen").length;

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          entry.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.relationship.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterRsvp === "all") return matchesSearch;
    return matchesSearch && entry.rsvpHadir === filterRsvp;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/98 text-stone-100 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-stone-950 border border-stone-800 w-full max-w-5xl rounded-3xl shadow-2xl relative overflow-hidden my-8" id="admin-panel">
        
        {/* HEADER BRANDING */}
        <div className="border-b border-stone-850 px-6 py-4 flex items-center justify-between bg-stone-900/40">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-lg tracking-wide text-amber-200">Panel Pengantin &amp; Administrator</h2>
          </div>
          <button 
            onClick={() => {
              if (testAudio) testAudio.pause();
              onClose();
            }}
            className="p-1 px-3 border border-stone-800 rounded-lg text-xs hover:bg-stone-900 transition-all text-stone-400 hover:text-stone-100 cursor-pointer"
          >
            <X className="w-4 h-4 inline-block mr-1" /> Tutup Panel
          </button>
        </div>

        {/* LOG IN / PASSCODE REQUIREMENT */}
        {!isAuthenticated ? (
          <div className="py-24 px-6 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Key className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-medium text-amber-200">Autentikasi Pengantin</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                Akses panel ini hanya dibatasi untuk Gian &amp; Cucu sebagai penyelenggara. Sila masukkan kode PIN verifikasi panitia.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5 font-sans">Kode PIN Sandi</label>
                <input 
                  type="password"
                  placeholder="Masukkan 6 Digit PIN Khusus (cth: 140526)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl px-4 py-3 text-center tracking-widest text-stone-100 font-bold font-mono text-lg transition-all"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/30 px-3 py-2.5 rounded-lg font-sans font-medium text-center">
                  {errorMsg}
                </p>
              )}

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 py-3 rounded-xl font-serif font-bold text-xs uppercase tracking-wider hover:from-amber-400 hover:to-yellow-500 transition-all cursor-pointer shadow-lg shadow-amber-550/10"
              >
                <Unlock className="w-3.5 h-3.5 inline mr-1.5" /> Masuk Panel Admin
              </button>
            </form>
            
            <div className="pt-4 text-[10px] text-stone-500 italic">
              Petunjuk: PIN adalah tanggal pernikahan (<b>120926</b>) atau cukup ketik kata sandi &quot;<b>admin</b>&quot;.
            </div>
          </div>
        ) : (
          
          <div className="p-6 md:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
            
            {/* STATS OVERVIEW CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-stone-900 border border-stone-850 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold uppercase tracking-wider font-sans">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Total RSVP</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-serif font-bold text-amber-200">{totalRsvpResponses}</span>
                  <span className="text-[10px] text-stone-400 font-mono">Tanggapan</span>
                </div>
              </div>

              <div className="p-4 bg-stone-900 border border-stone-850 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold uppercase tracking-wider font-sans">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  <span>Hadir (Pax)</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-serif font-bold text-green-400">{attendingGuests}</span>
                  <span className="text-[9.5px] text-stone-400 font-sans">Pax dari {attendingCount} Tamu</span>
                </div>
              </div>

              <div className="p-4 bg-stone-900 border border-stone-850 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold uppercase tracking-wider font-sans">
                  <HelpCircle className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Ragu-Ragu</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-serif font-bold text-yellow-400">{unsureCount}</span>
                  <span className="text-[10px] text-stone-400 font-mono">Orang</span>
                </div>
              </div>

              <div className="p-4 bg-stone-900 border border-stone-850 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold uppercase tracking-wider font-sans">
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                  <span>Berhalangan</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-serif font-bold text-red-400">{absentCount}</span>
                  <span className="text-[10px] text-stone-500 font-mono">Orang</span>
                </div>
              </div>
            </div>

            {/* TWO COLUMN WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: GUEST MESSAGES DIRECTORY */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <h3 className="font-serif font-bold text-base">Manajemen Buku Tamu &amp; RSVP</h3>
                  </div>
                  
                  <button 
                    onClick={fetchGuestbook} 
                    className="self-end sm:self-auto text-[10px] uppercase font-mono tracking-wider flex items-center gap-1 text-stone-400 hover:text-amber-400 cursor-pointer py-1 px-2.5 bg-stone-900 rounded border border-stone-800 shadow-sm"
                  >
                    <RefreshCw className={`w-2.5 h-2.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Muat Ulang</span>
                  </button>
                </div>

                {/* SEARCH AND RSVP FILTERS */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input 
                      type="text" 
                      placeholder="Cari tamu, relasi, komentar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-900/60 border border-stone-800 focus:border-amber-400/40 focus:outline-none rounded-xl pr-4 pl-10 py-2.5 text-xs font-sans text-stone-200"
                    />
                  </div>

                  <div className="flex bg-stone-900 rounded-xl p-1 border border-stone-800">
                    {[
                      { val: "all", lab: "Semua" },
                      { val: "hadir", lab: "Hadir" },
                      { val: "ragu", lab: "Ragu" },
                      { val: "absen", lab: "Absen" },
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        onClick={() => setFilterRsvp(btn.val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans cursor-pointer transition-all ${
                          filterRsvp === btn.val 
                            ? "bg-amber-500/15 text-amber-300 font-bold border border-amber-500/10" 
                            : "text-stone-400 hover:text-stone-200"
                        }`}
                      >
                        {btn.lab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GUESTBOOK DATATABLE/LIST */}
                <div className="max-h-[460px] overflow-y-auto pr-2 space-y-3 shadow-inner custom-scrollbar-pane border border-stone-850 p-3 bg-stone-950/40 rounded-2xl">
                  {loading && entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-2">
                      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-stone-550 text-xs font-mono">Sinkronisasi data tamu...</p>
                    </div>
                  ) : filteredEntries.length === 0 ? (
                    <div className="text-center py-12 text-stone-500 text-xs font-sans">
                      Tidak ada data tamu yang cocok dengan pencarian Anda.
                    </div>
                  ) : (
                    filteredEntries.map((item, idx) => (
                      <div 
                        key={item.id}
                        className="p-4 bg-stone-900/50 border border-stone-850 rounded-xl relative group flex flex-col justify-between space-y-2.5 hover:bg-stone-900/80 hover:border-stone-800 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-300 border border-amber-550/15 flex items-center justify-center font-bold text-xs font-serif uppercase">
                              {item.name.charAt(0)}
                            </span>
                            <div>
                              <h4 className="text-xs font-bold font-serif text-stone-200">{item.name}</h4>
                              <p className="text-[10px] text-stone-400 font-sans">{item.relationship}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {item.rsvpHadir === "hadir" && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/10">
                                Hadir ({item.countGuests} Pax)
                              </span>
                            )}
                            {item.rsvpHadir === "ragu" && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/10">
                                Ragu-Ragu
                              </span>
                            )}
                            {item.rsvpHadir === "absen" && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/10">
                                Absen
                              </span>
                            )}
                            
                            {/* DELETE BUTTON */}
                            <button
                              onClick={() => handleDeleteEntry(item.id, item.name)}
                              className="p-1.5 rounded-md bg-stone-950/80 text-stone-400 hover:text-red-400 border border-stone-850 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Hapus Pesan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-stone-300 text-xs italic font-light font-sans pl-1 border-l-2 border-stone-800 leading-relaxed">
                          &ldquo;{item.comment}&rdquo;
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: CONFIGURATORS */}
              <div className="lg:col-span-5 space-y-8">
                
                {/* 1. DINAMIS NAME LINK GENERATOR */}
                <div className="p-5 bg-stone-900 border border-stone-850 rounded-2xl text-left space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif font-bold text-sm text-amber-200">Generator Link Nama Dinamis</h4>
                  </div>
                  
                  <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                    Ketikkan nama tamu undangan Anda untuk membangkitkan (generate) link website personal yang unik serta draf chat WhatsApp instan.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1 font-sans">Nama Tamu Undangan</label>
                      <input 
                        type="text"
                        placeholder="cth: Bapak Husein Al-Khawarizmi & Istri"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400/50 focus:outline-none rounded-lg px-3 py-2 text-xs font-sans text-stone-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1 font-sans">Kategori Relasi</label>
                        <select 
                          value={relation}
                          onChange={(e) => setRelation(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400/50 focus:outline-none rounded-lg px-3 py-2 text-xs font-sans text-stone-300"
                        >
                          <option value="Teman">Teman</option>
                          <option value="Sahabat">Sahabat</option>
                          <option value="Keluarga">Keluarga</option>
                          <option value="Tetangga">Tetangga</option>
                          <option value="Kerabat Pengantin">Kerabat Pengantin</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1 font-sans">Gaya Greeting WA</label>
                        <select
                          value={templateIndex}
                          onChange={(e) => setTemplateIndex(Number(e.target.value))}
                          className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400/50 focus:outline-none rounded-lg px-3 py-2 text-xs font-sans text-stone-300"
                        >
                          {messageTemplates.map((t, idx) => (
                            <option key={idx} value={idx}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* LIVE URL PREVIEW */}
                    <div className="bg-stone-950 p-3 rounded-lg border border-stone-850 space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider font-sans">Live URL Unik:</span>
                        <button 
                          onClick={handleCopyLink}
                          className="text-[10px] text-amber-500 hover:text-amber-400 flex items-center gap-1 font-sans font-bold cursor-pointer"
                        >
                          {copiedLink ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedLink ? "Tersalin" : "Salin Link"}</span>
                        </button>
                      </div>
                      <p className="text-[10px] truncate leading-normal text-stone-300 font-medium">
                        {getInviteUrl()}
                      </p>
                    </div>

                    {/* LIVE TEXT STATEMENT PREVIEW */}
                    <div className="bg-stone-950 p-3 rounded-lg border border-stone-850 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider font-sans">Pratinjau Draf Pesan WA:</span>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={handleCopyWAText}
                            className="text-[10px] text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {copiedWA ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedWA ? "Tersalin" : "Salin Chat"}</span>
                          </button>
                        </div>
                      </div>
                      <textarea 
                        readOnly
                        value={getWaText()}
                        className="w-full bg-stone-950 border-0 outline-none text-[10px] font-sans h-24 text-stone-400 p-0 text-left resize-none focus:ring-0 leading-relaxed font-light custom-scrollbar-pane"
                      />
                    </div>

                    <button 
                      onClick={handleShareWa}
                      className="w-full py-2 bg-green-600 hover:bg-green-500 text-stone-950 text-xs font-serif font-bold tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all active:scale-98"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Kirim Undangan via WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* 2. BACKGROUND SOUND SETTINGS */}
                <div className="p-5 bg-stone-900 border border-stone-850 rounded-2xl text-left space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                    <Music className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif font-bold text-sm text-amber-200">Konfigurasi Musik Latar</h4>
                  </div>
                  
                  <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                    Atur lagu romantis yang otomatis berputar saat undangan dibuka oleh tamu istimewa Anda. Preset Bruno Mars dan Zayn-Usher telah siap dipakai.
                  </p>

                  <div className="space-y-4 font-sans text-xs">
                    
                    {/* MUSIC PRESETS ROW */}
                    <div>
                      <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-2">Pilih dari Lagu Romantis Pilihan</label>
                      <div className="space-y-1.5">
                        {musicPresets.map((preset, index) => {
                          const isSelected = songUrl === preset.url;
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                setSongUrl(preset.url);
                                setSongTitle(preset.title);
                                if (testPlaying && testAudio) {
                                  testAudio.pause();
                                  setTestPlaying(false);
                                }
                              }}
                              className={`w-full text-left p-2.5 rounded-lg border text-xs leading-snug flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-amber-500/10 border-amber-500 text-amber-300"
                                  : "bg-stone-950/60 border-stone-855 text-stone-400 hover:text-stone-300 hover:border-stone-800"
                              }`}
                            >
                              <div>
                                <p className="font-semibold text-[11px] truncate">{preset.title}</p>
                                <p className="text-[9px] text-stone-500 font-mono truncate">{preset.url}</p>
                              </div>
                              {isSelected && <Music className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2 animate-bounce" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="h-px bg-stone-850 my-1.5" />

                    {/* CUSTOM MUSIC URL INPUT */}
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Judul Musik Kustom</label>
                        <input 
                          type="text"
                          placeholder="cth: Bruno Mars - Rest of My Life"
                          value={songTitle}
                          onChange={(e) => setSongTitle(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400/50 focus:outline-none rounded-lg px-3 py-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Tautan URL Berkas MP3 (.mp3)</label>
                        <input 
                          type="text"
                          placeholder="Masukkan tautan http/https file mp3 langsung"
                          value={songUrl}
                          onChange={(e) => setSongUrl(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400/50 focus:outline-none rounded-lg px-3 py-2 font-mono text-[10px]"
                        />
                      </div>
                    </div>

                    {/* LIVE PLAYER CONTROLS & SAVE */}
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex gap-2">
                        <button 
                          onClick={triggerTestPlay}
                          className={`px-4 py-2.5 border rounded-xl text-xs flex items-center gap-1.5 font-bold cursor-pointer transition-all shrink-0 ${
                            testPlaying 
                              ? "bg-stone-800 text-amber-400 border-amber-500/20" 
                              : "bg-stone-950 border-stone-800 text-stone-300 hover:text-amber-400 hover:border-stone-700"
                          }`}
                        >
                          {testPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <Music className="w-3.5 h-3.5" />}
                          <span>{testPlaying ? "Hentikan" : "Tes Putar"}</span>
                        </button>

                        <button 
                          onClick={handleSaveMusic}
                          disabled={musicSaving || downloadProgress}
                          className="flex-1 py-2.5 bg-stone-900 border border-stone-850 hover:bg-stone-800 font-sans font-bold text-stone-200 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {musicSaving ? (
                            <div className="w-3.5 h-3.5 border-2 border-stone-300 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span>Gunakan URL</span>
                        </button>
                      </div>

                      <button 
                        onClick={handleDownloadMusic}
                        disabled={downloadProgress || musicSaving}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 font-serif font-extrabold text-stone-950 rounded-xl tracking-wider uppercase text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:from-amber-400 hover:to-yellow-500 transition-all shadow-md transform active:scale-98"
                      >
                        {downloadProgress ? (
                          <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 shrink-0" />
                        )}
                        <span>{downloadProgress ? "Sedang Mengunduh ke Server..." : "Unduh Lagu & Simpan Lokal"}</span>
                      </button>
                    </div>

                    <div className="h-px bg-stone-850 my-1.5" />

                    {/* DIRECT MP3 FILE UPLOADER FROM USER'S DEVICE */}
                    <div className="space-y-2">
                      <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                        Atau Unggah Langsung Berkas MP3 dari Device Anda
                      </label>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 relative overflow-hidden ${
                          uploadDragging
                            ? "border-amber-400 bg-amber-500/10 text-amber-300"
                            : "border-stone-800 bg-stone-950/40 text-stone-400 hover:border-amber-400/50 hover:bg-stone-950/70"
                        }`}
                        onClick={() => document.getElementById("local-mp3-upload")?.click()}
                      >
                        <input
                          id="local-mp3-upload"
                          type="file"
                          accept=".mp3,audio/mpeg"
                          className="hidden"
                          onChange={handleFileInputChange}
                          disabled={uploadProgress}
                        />

                        {uploadProgress ? (
                          <div className="flex flex-col items-center space-y-2 py-2">
                            <div className="w-7 h-7 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                            <p className="font-serif font-bold text-xs text-amber-200">Sedang mengunggah berkas musik...</p>
                            <p className="text-[10px] text-stone-500 font-mono">Tunggu sampai transfer data selesai</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
                            <div className="p-2 bg-stone-900 border border-stone-800 rounded-full text-amber-400">
                              <Download className="w-5 h-5 animate-pulse rotate-180" />
                            </div>
                            <p className="font-serif font-bold text-xs text-stone-200">
                              Seret &amp; Letakkan Lagu di Sini
                            </p>
                            <p className="text-[10px] text-stone-500 font-sans">
                              Atau <span className="text-amber-400 font-semibold underline">Klik untuk memilih file .mp3</span>
                            </p>
                            <p className="text-[9px] text-stone-500 font-mono">Status: Maks 15MB, Format MP3 hasil download</p>
                          </div>
                        )}
                      </div>

                      {uploadError && (
                        <p className="text-[10px] text-red-400 bg-red-950/40 border border-red-900/30 px-2.5 py-1.5 rounded-lg">
                          ⚠️ Gagal mengunggah: {uploadError}
                        </p>
                      )}

                      {uploadSuccess && (
                        <p className="text-[10px] text-green-400 bg-green-950/40 border border-green-900/40 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                          <span>Berhasil menanam lagu romantis dari device ke dalam server aplikasi secara instan!</span>
                        </p>
                      )}
                    </div>

                    {downloadError && (
                      <p className="text-[10px] text-red-400 bg-red-950/40 border border-red-900/30 px-2.5 py-1.5 rounded-lg">
                        ⚠️ Gagal mengunduh: {downloadError}
                      </p>
                    )}

                    {downloadSuccess && (
                      <p className="text-[10px] text-green-400 bg-green-950/40 border border-green-900/40 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <span>Sukses diunduh! Lagu kini berputar dari server lokal secara instan.</span>
                      </p>
                    )}

                    {musicSuccess && (
                      <p className="text-[10px] text-green-400 bg-green-950/40 border border-green-900/40 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <span>Musik berhasil dikonfigurasi &amp; disimpan secara permanen!</span>
                      </p>
                    )}

                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
