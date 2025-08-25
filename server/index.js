import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import shortid from "shortid";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- Connect MongoDB ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Schema & Model ---
const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  shortUrl: { type: String, required: true },
  visitCount: { type: Number, default: 0 },   // <-- Track clicks
  createdAt: { type: Date, default: Date.now },
});

const Url = mongoose.model("Url", urlSchema);

// --- API Routes ---

// 1️⃣ Create short URL
app.post("/api/shorten", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    let existing = await Url.findOne({ originalUrl: url });
    if (existing) {
      return res.json({ shortUrl: existing.shortUrl });
    }

  const shortCode = shortid.generate();
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  const shortUrl = `${baseUrl}/${shortCode}`;

    const newUrl = new Url({
      originalUrl: url,
      shortCode,
      shortUrl,
    });

    await newUrl.save();
    res.json({ shortUrl });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 2️⃣ Redirect to original + track visits
app.get("/:code", async (req, res) => {
  try {
    const urlData = await Url.findOne({ shortCode: req.params.code });
    if (urlData) {
      urlData.visitCount += 1;    // increment visits
      await urlData.save();
      return res.redirect(urlData.originalUrl);
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

// 3️⃣ Get all shortened URLs with stats
app.get("/api/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 }); // latest first
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
