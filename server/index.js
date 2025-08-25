import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import shortid from "shortid";
import helmet from "helmet";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: isProduction ? process.env.CLIENT_ORIGIN : "*",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

// Health check endpoint
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// --- Connect MongoDB ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

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

//  Create short URL
app.post("/api/shorten", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string" || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "A valid URL is required" });
  }
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
    console.error("Shorten error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 2️ Redirect to original + track visits
app.get("/:code", async (req, res) => {
  try {
    const urlData = await Url.findOne({ shortCode: req.params.code });
    if (urlData) {
      urlData.visitCount += 1;
      await urlData.save();
      // Prevent open redirect vulnerabilities
      const redirectUrl = urlData.originalUrl.startsWith("http") ? urlData.originalUrl : `http://${urlData.originalUrl}`;
      return res.redirect(redirectUrl);
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (err) {
    console.error("Redirect error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

//Get all shortened URLs with stats
app.get("/api/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error("Admin fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
