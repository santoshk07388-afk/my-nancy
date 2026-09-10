import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Accept up to 50MB payloads for batch base64 images
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Data persistence directory
  const DATA_DIR = path.join(process.cwd(), "data");
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const PHOTOS_FILE = path.join(DATA_DIR, "saved_photos.json");
  const TIMELINE_FILE = path.join(DATA_DIR, "saved_timeline.json");
  const SETTINGS_FILE = path.join(DATA_DIR, "site_settings.json");

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Get persisted photos
  app.get("/api/photos", (_req, res) => {
    try {
      if (fs.existsSync(PHOTOS_FILE)) {
        const fileContent = fs.readFileSync(PHOTOS_FILE, "utf-8");
        const photos = JSON.parse(fileContent);
        return res.json({ photos });
      }
      return res.json({ photos: null });
    } catch (error) {
      console.error("Error reading saved photos:", error);
      return res.status(500).json({ error: "Failed to read saved photos" });
    }
  });

  // Save/update photos
  app.post("/api/photos", (req, res) => {
    try {
      const { photos } = req.body;
      if (!photos || !Array.isArray(photos)) {
        return res.status(400).json({ error: "Invalid photos array" });
      }
      fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2), "utf-8");
      return res.json({ success: true, count: photos.length });
    } catch (error) {
      console.error("Error writing saved photos:", error);
      return res.status(500).json({ error: "Failed to persist photos" });
    }
  });

  // Reset photos
  app.delete("/api/photos", (_req, res) => {
    try {
      if (fs.existsSync(PHOTOS_FILE)) {
        fs.unlinkSync(PHOTOS_FILE);
      }
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting photos:", error);
      return res.status(500).json({ error: "Failed to delete saved photos" });
    }
  });

  // Get persisted timeline
  app.get("/api/timeline", (_req, res) => {
    try {
      if (fs.existsSync(TIMELINE_FILE)) {
        const fileContent = fs.readFileSync(TIMELINE_FILE, "utf-8");
        const timeline = JSON.parse(fileContent);
        return res.json({ timeline });
      }
      return res.json({ timeline: null });
    } catch (error) {
      console.error("Error reading saved timeline:", error);
      return res.status(500).json({ error: "Failed to read saved timeline" });
    }
  });

  // Save/update timeline
  app.post("/api/timeline", (req, res) => {
    try {
      const { timeline } = req.body;
      if (!timeline || !Array.isArray(timeline)) {
        return res.status(400).json({ error: "Invalid timeline array" });
      }
      fs.writeFileSync(TIMELINE_FILE, JSON.stringify(timeline, null, 2), "utf-8");
      return res.json({ success: true, count: timeline.length });
    } catch (error) {
      console.error("Error writing saved timeline:", error);
      return res.status(500).json({ error: "Failed to persist timeline" });
    }
  });

  // Reset timeline
  app.delete("/api/timeline", (_req, res) => {
    try {
      if (fs.existsSync(TIMELINE_FILE)) {
        fs.unlinkSync(TIMELINE_FILE);
      }
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting timeline:", error);
      return res.status(500).json({ error: "Failed to delete saved timeline" });
    }
  });

  // Get site settings (privacy, passcode, etc.)
  app.get("/api/settings", (_req, res) => {
    try {
      if (fs.existsSync(SETTINGS_FILE)) {
        const fileContent = fs.readFileSync(SETTINGS_FILE, "utf-8");
        return res.json({ settings: JSON.parse(fileContent) });
      }
      return res.json({ settings: null });
    } catch (error) {
      console.error("Error reading site settings:", error);
      return res.status(500).json({ error: "Failed to read settings" });
    }
  });

  // Save site settings
  app.post("/api/settings", (req, res) => {
    try {
      const { settings } = req.body;
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
      return res.json({ success: true });
    } catch (error) {
      console.error("Error saving site settings:", error);
      return res.status(500).json({ error: "Failed to save settings" });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
