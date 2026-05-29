import express from "express";
import path from "path";
import fs from "fs";
import https from "https";
import http from "http";
import { createServer as createViteServer } from "vite";

// Helper function to download file from URLs including supporting redirects
function downloadUrl(url: string, destPath: string, callback: (err?: Error) => void) {
  const protocol = url.startsWith("https") ? https : http;
  
  protocol.get(url, (response) => {
    // Handle redirect
    if (response.statusCode === 301 || response.statusCode === 302) {
      const redirectUrl = response.headers.location;
      if (redirectUrl) {
        downloadUrl(redirectUrl, destPath, callback);
        return;
      }
    }

    if (response.statusCode !== 200) {
      callback(new Error(`Server returned status code ${response.statusCode}`));
      return;
    }

    const file = fs.createWriteStream(destPath);
    response.pipe(file);

    file.on("finish", () => {
      file.close();
      callback();
    });

    file.on("error", (err) => {
      fs.unlink(destPath, () => {});
      callback(err);
    });
  }).on("error", (err) => {
    fs.unlink(destPath, () => {});
    callback(err);
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const GUESTBOOK_FILE = path.join(process.cwd(), "guestbook.json");
  const LOCAL_SONG_FILE = path.join(process.cwd(), "song.mp3");

  const checkAndDownloadLocalSong = () => {
    if (fs.existsSync(LOCAL_SONG_FILE)) {
      console.log("Local song.mp3 found.");
      return;
    }
    console.log("Downloading default romantic song to local storage...");
    const defaultUrl = "https://pub-c5e31b5cdafb419a86617dd1d3e92ef9.r2.dev/ZAYN%20%26%20Usher%20-%20Risk%20It%20All.mp3";
    downloadUrl(defaultUrl, LOCAL_SONG_FILE, (err) => {
      if (err) {
        console.error("Failed to download local backup song:", err.message);
      } else {
        console.log("Romantic song successfully downloaded and buffered locally!");
      }
    });
  };

  // Start background download for instant playback on first load
  checkAndDownloadLocalSong();

  // Initial guestbook mock data to make it look active, realistic, and charming
  const defaultEntries = [
    {
      id: "1",
      name: "Budi Santoso",
      relationship: "Teman Kuliah",
      rsvpHadir: "hadir",
      countGuests: 2,
      comment: "Selamat atas pernikahannya Gian & Cucu! Semoga dilancarkan semua prosesi acaranya dan menjadi keluarga yang sakinah, mawaddah, warahmah. Menuju ibadah terpanjang dengan bahagia!",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
    },
    {
      id: "2",
      name: "Siti Rahma & Keluarga",
      relationship: "Kerabat Shinta",
      rsvpHadir: "hadir",
      countGuests: 3,
      comment: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Selamat menempuh hidup baru ya, Shinta sayang! Sangat bahagia mendengar kabar gembira ini.",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
    },
    {
      id: "3",
      name: "Dimas & Astri",
      relationship: "Sahabat Pengantin",
      rsvpHadir: "hadir",
      countGuests: 2,
      comment: "Selamat mamen! Gak menyangka akhirnya nyanthol juga. Insya Allah gue dateng sama istri. Lancar-lancar ya sob sampe hari H!",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
    },
    {
      id: "4",
      name: "Ibu Hartati",
      relationship: "Tetangga",
      rsvpHadir: "absen",
      countGuests: 0,
      comment: "Selamat menempuh hidup baru untuk kedua mempelai. Mohon maaf Ibu tidak bisa hadir langsung karena sedang di luar kota. Doa terbaik dari jauh semoga samawa selalu.",
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
    }
  ];

  let guestbookEntries = [...defaultEntries];
  try {
    if (fs.existsSync(GUESTBOOK_FILE)) {
      const fileData = fs.readFileSync(GUESTBOOK_FILE, "utf-8");
      guestbookEntries = JSON.parse(fileData);
    } else {
      fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(defaultEntries, null, 2));
    }
  } catch (err) {
    console.error("Error reading/writing guestbook file:", err);
  }

  const SETTINGS_FILE = path.join(process.cwd(), "settings.json");
  const defaultSettings = {
    activeSongUrl: "/api/music.mp3",
    activeSongTitle: "ZAYN, Usher & Jacquees - Risk It All (Aplikasi Lokal)",
  };

  let appSettings = { ...defaultSettings };
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const fileData = fs.readFileSync(SETTINGS_FILE, "utf-8");
      appSettings = JSON.parse(fileData);
      // Auto upgrade old remote URLs to local mp3 server streaming to guarantee robust loading and bypassing CORS
      if (appSettings.activeSongUrl && appSettings.activeSongUrl.startsWith("http") && !appSettings.activeSongUrl.includes("/api/music.mp3")) {
        appSettings.activeSongUrl = "/api/music.mp3";
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2));
      }
    } else {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
    }
  } catch (err) {
    console.error("Error reading/writing settings file:", err);
  }

  // GET guestbook entries
  app.get("/api/guestbook", (req, res) => {
    res.json(guestbookEntries);
  });

  // POST new guestbook entry
  app.post("/api/guestbook", (req, res) => {
    const { name, relationship, rsvpHadir, comment, countGuests } = req.body;

    if (!name || !rsvpHadir || !comment) {
      return res.status(400).json({ error: "Missing required fields: name, rsvpHadir, comment" });
    }

    const newEntry = {
      id: String(Date.now()),
      name: String(name).trim(),
      relationship: String(relationship || "Teman").trim(),
      rsvpHadir: String(rsvpHadir),
      countGuests: Number(countGuests) || 1,
      comment: String(comment).trim(),
      createdAt: new Date().toISOString()
    };

    guestbookEntries.unshift(newEntry);

    try {
      fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(guestbookEntries, null, 2));
    } catch (err) {
      console.error("Error writing to guestbook file:", err);
    }

    res.status(201).json(newEntry);
  });

  // DELETE a guestbook entry (Admin feature)
  app.delete("/api/guestbook/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = guestbookEntries.length;
    guestbookEntries = guestbookEntries.filter((entry) => entry.id !== id);

    if (guestbookEntries.length < initialLength) {
      try {
        fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(guestbookEntries, null, 2));
        res.json({ success: true, message: "Komentar berhasil dihapus." });
      } catch (err) {
        console.error("Error writing to guestbook file on deletion:", err);
        res.status(500).json({ error: "Gagal menyimpan perubahan." });
      }
    } else {
      res.status(404).json({ error: "Komentar tidak ditemukan." });
    }
  });

  // GET app settings (for current background music etc.)
  app.get("/api/settings", (req, res) => {
    res.json(appSettings);
  });

  // GET local background music stream
  app.get("/api/music.mp3", (req, res) => {
    if (fs.existsSync(LOCAL_SONG_FILE)) {
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Access-Control-Allow-Origin", "*");
      fs.createReadStream(LOCAL_SONG_FILE).pipe(res);
    } else {
      // In case download hasn't finished, redirect to remote source as fallback
      res.redirect("https://pub-c5e31b5cdafb419a86617dd1d3e92ef9.r2.dev/ZAYN%20%26%20Usher%20-%20Risk%20It%20All.mp3");
    }
  });

  // POST download any custom mp3 url to local server to prevent CORS and slow connections
  app.post("/api/download-song", (req, res) => {
    const { url, title } = req.body;

    if (!url || !title) {
      return res.status(400).json({ error: "URL dan Judul lagu wajib diisi." });
    }

    // Since users may use any random URL, download to server disk
    console.log(`Downloading custom song to server: ${title} (${url})`);
    const tempDest = path.join(process.cwd(), "song_temp.mp3");

    downloadUrl(url, tempDest, (err) => {
      if (err) {
        console.error("Gagal mengunduh lagu kustom:", err.message);
        return res.status(500).json({ error: `Gagal mengunduh musik dari URL: ${err.message}` });
      }

      try {
        fs.renameSync(tempDest, LOCAL_SONG_FILE);
        
        // Save to settings
        appSettings.activeSongUrl = "/api/music.mp3";
        appSettings.activeSongTitle = `${title} (Aplikasi Lokal)`;
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2));

        res.json({ success: true, settings: appSettings });
      } catch (renameErr) {
        console.error("Rename error:", renameErr);
        res.status(500).json({ error: "Gagal memproses file hasil unduhan." });
      }
    });
  });

  // POST upload local mp3 file directly from device
  app.post("/api/upload-song", (req, res) => {
    const songTitle = req.query.title ? decodeURIComponent(req.query.title as string) : "Lagu Kustom Pengantin";
    console.log(`Menerima unggahan lagu dari device pengguna: "${songTitle}"`);

    const writeStream = fs.createWriteStream(LOCAL_SONG_FILE);
    req.pipe(writeStream);

    writeStream.on("finish", () => {
      // Perbarui konfigurasi settings
      appSettings.activeSongUrl = "/api/music.mp3";
      appSettings.activeSongTitle = `${songTitle} (Hasil Unggah)`;
      
      try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2));
        res.json({ success: true, settings: appSettings });
      } catch (err) {
        console.error("Gagal memperbarui file pengaturan pasca unggah:", err);
        res.status(500).json({ error: "Lagu berhasil diunggah tapi gagal memperbarui pengaturan." });
      }
    });

    writeStream.on("error", (err) => {
      console.error("Terjadi galat saat menulis unggahan musik:", err);
      res.status(500).json({ error: "Gagal menyimpan berkas musik kustom di server." });
    });
  });

  // POST update app settings
  app.post("/api/settings", (req, res) => {
    const { activeSongUrl, activeSongTitle } = req.body;

    if (!activeSongUrl || !activeSongTitle) {
      return res.status(400).json({ error: "URL dan Judul lagu wajib diisi." });
    }

    appSettings.activeSongUrl = activeSongUrl;
    appSettings.activeSongTitle = activeSongTitle;

    try {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2));
      res.json({ success: true, settings: appSettings });
    } catch (err) {
      console.error("Error writing to settings file:", err);
      res.status(500).json({ error: "Gagal menyimpan konfigurasi musik." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
