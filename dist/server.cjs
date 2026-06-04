var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_https = __toESM(require("https"), 1);
var import_http = __toESM(require("http"), 1);
var import_vite = require("vite");
function downloadUrl(url, destPath, callback) {
  const protocol = url.startsWith("https") ? import_https.default : import_http.default;
  protocol.get(url, (response) => {
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
    const file = import_fs.default.createWriteStream(destPath);
    response.pipe(file);
    file.on("finish", () => {
      file.close();
      callback();
    });
    file.on("error", (err) => {
      import_fs.default.unlink(destPath, () => {
      });
      callback(err);
    });
  }).on("error", (err) => {
    import_fs.default.unlink(destPath, () => {
    });
    callback(err);
  });
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  const GUESTBOOK_FILE = import_path.default.join(process.cwd(), "guestbook.json");
  const LOCAL_SONG_FILE = import_path.default.join(process.cwd(), "song.mp3");
  const checkAndDownloadLocalSong = () => {
    if (import_fs.default.existsSync(LOCAL_SONG_FILE)) {
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
  checkAndDownloadLocalSong();
  const defaultEntries = [
    {
      id: "1",
      name: "Fulan dan Istri",
      relationship: "Example",
      rsvpHadir: "hadir",
      countGuests: 2,
      comment: "Test Test Test!",
      createdAt: new Date(Date.now() - 36e5 * 4).toISOString()
      // 4 hours ago
    }
  ];
  let guestbookEntries = [...defaultEntries];
  try {
    if (import_fs.default.existsSync(GUESTBOOK_FILE)) {
      const fileData = import_fs.default.readFileSync(GUESTBOOK_FILE, "utf-8");
      guestbookEntries = JSON.parse(fileData);
    } else {
      import_fs.default.writeFileSync(GUESTBOOK_FILE, JSON.stringify(defaultEntries, null, 2));
    }
  } catch (err) {
    console.error("Error reading/writing guestbook file:", err);
  }
  const SETTINGS_FILE = import_path.default.join(process.cwd(), "settings.json");
  const defaultSettings = {
    activeSongUrl: "/api/music.mp3",
    activeSongTitle: "ZAYN, Usher & Jacquees - Risk It All (Aplikasi Lokal)"
  };
  let appSettings = { ...defaultSettings };
  try {
    if (import_fs.default.existsSync(SETTINGS_FILE)) {
      const fileData = import_fs.default.readFileSync(SETTINGS_FILE, "utf-8");
      appSettings = JSON.parse(fileData);
      if (appSettings.activeSongUrl && appSettings.activeSongUrl.startsWith("http") && !appSettings.activeSongUrl.includes("/api/music.mp3")) {
        appSettings.activeSongUrl = "/api/music.mp3";
        import_fs.default.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2));
      }
    } else {
      import_fs.default.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
    }
  } catch (err) {
    console.error("Error reading/writing settings file:", err);
  }
  app.get("/api/guestbook", (req, res) => {
    res.json(guestbookEntries);
  });
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
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    guestbookEntries.unshift(newEntry);
    try {
      import_fs.default.writeFileSync(GUESTBOOK_FILE, JSON.stringify(guestbookEntries, null, 2));
    } catch (err) {
      console.error("Error writing to guestbook file:", err);
    }
    res.status(201).json(newEntry);
  });
  app.delete("/api/guestbook/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = guestbookEntries.length;
    guestbookEntries = guestbookEntries.filter((entry) => entry.id !== id);
    if (guestbookEntries.length < initialLength) {
      try {
        import_fs.default.writeFileSync(GUESTBOOK_FILE, JSON.stringify(guestbookEntries, null, 2));
        res.json({ success: true, message: "Komentar berhasil dihapus." });
      } catch (err) {
        console.error("Error writing to guestbook file on deletion:", err);
        res.status(500).json({ error: "Gagal menyimpan perubahan." });
      }
    } else {
      res.status(404).json({ error: "Komentar tidak ditemukan." });
    }
  });
  app.get("/api/settings", (req, res) => {
    res.json(appSettings);
  });
  app.get("/api/music.mp3", (req, res) => {
    if (import_fs.default.existsSync(LOCAL_SONG_FILE)) {
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Access-Control-Allow-Origin", "*");
      import_fs.default.createReadStream(LOCAL_SONG_FILE).pipe(res);
    } else {
      res.redirect("https://pub-c5e31b5cdafb419a86617dd1d3e92ef9.r2.dev/ZAYN%20%26%20Usher%20-%20Risk%20It%20All.mp3");
    }
  });
  app.post("/api/download-song", (req, res) => {
    const { url, title } = req.body;
    if (!url || !title) {
      return res.status(400).json({ error: "URL dan Judul lagu wajib diisi." });
    }
    console.log(`Downloading custom song to server: ${title} (${url})`);
    const tempDest = import_path.default.join(process.cwd(), "song_temp.mp3");
    downloadUrl(url, tempDest, (err) => {
      if (err) {
        console.error("Gagal mengunduh lagu kustom:", err.message);
        return res.status(500).json({ error: `Gagal mengunduh musik dari URL: ${err.message}` });
      }
      try {
        import_fs.default.renameSync(tempDest, LOCAL_SONG_FILE);
        appSettings.activeSongUrl = "/api/music.mp3";
        appSettings.activeSongTitle = `${title} (Aplikasi Lokal)`;
        import_fs.default.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2));
        res.json({ success: true, settings: appSettings });
      } catch (renameErr) {
        console.error("Rename error:", renameErr);
        res.status(500).json({ error: "Gagal memproses file hasil unduhan." });
      }
    });
  });
  app.post("/api/upload-song", (req, res) => {
    const songTitle = req.query.title ? decodeURIComponent(req.query.title) : "Lagu Kustom Pengantin";
    console.log(`Menerima unggahan lagu dari device pengguna: "${songTitle}"`);
    const writeStream = import_fs.default.createWriteStream(LOCAL_SONG_FILE);
    req.pipe(writeStream);
    writeStream.on("finish", () => {
      appSettings.activeSongUrl = "/api/music.mp3";
      appSettings.activeSongTitle = `${songTitle} (Hasil Unggah)`;
      try {
        import_fs.default.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2));
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
  app.post("/api/settings", (req, res) => {
    const { activeSongUrl, activeSongTitle } = req.body;
    if (!activeSongUrl || !activeSongTitle) {
      return res.status(400).json({ error: "URL dan Judul lagu wajib diisi." });
    }
    appSettings.activeSongUrl = activeSongUrl;
    appSettings.activeSongTitle = activeSongTitle;
    try {
      import_fs.default.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2));
      res.json({ success: true, settings: appSettings });
    } catch (err) {
      console.error("Error writing to settings file:", err);
      res.status(500).json({ error: "Gagal menyimpan konfigurasi musik." });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
