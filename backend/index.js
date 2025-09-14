import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import authMiddleware from "./middlewares/authentication.js";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "./utils/cloudinary.js";
import os from "os";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serving static files
app.use(express.static(path.join(__dirname, "public", "dist")));

//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin:
      "https://reimagined-space-disco-jxwq7567vj43q4j9-5173.app.github.dev",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
// app.options("*", cors());
app.use(cookieParser());
// Connections
connectDB();

// Helper to format bytes into human-readable values
function formatBytes(bytes) {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

// Helper to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${days}d ${hrs}h ${mins}m ${secs}s`;
}

app.get("/api/", async (req, res) => {
  try {
    // MongoDB connection
    const conn = await connectDB();

    // Cloudinary ping (can fail if not configured)
    const ping = await cloudinary.api.ping();
    // Process / runtime info
    const memory = process.memoryUsage();

    res.json({
      APIStatus: true,
      mongodbStatus: conn || "Disconnected",
      cloudinaryStatus: ping,

      // Process / runtime info
      uptime: formatUptime(process.uptime()),
      timestamp: new Date().toISOString(),
      pid: process.pid,
      nodeVersion: process.version,
      memoryUsage: {
        rss: formatBytes(memory.rss),
        heapTotal: formatBytes(memory.heapTotal),
        heapUsed: formatBytes(memory.heapUsed),
        external: formatBytes(memory.external),
        arrayBuffers: formatBytes(memory.arrayBuffers),
        raw: memory, // keep raw numbers too
      },
      cpuUsage: process.cpuUsage(),
      platform: process.platform,
      arch: process.arch,

      // OS info
      osHostname: os.hostname(),
      osType: os.type(),
      osRelease: os.release(),
      osUptime: formatUptime(os.uptime()),
      totalMemory: formatBytes(os.totalmem()),
      freeMemory: formatBytes(os.freemem()),
      cpuCount: os.cpus().length,
      loadAverage: os.loadavg(),
    });
  } catch (error) {
    res.status(500).json({
      APIStatus: false,
      error: error.message,
    });
  }
});

// Routes

//auth
import authRoutes from "./routes/authentication.js";
app.use("/api/auth", authRoutes);

//check user login
app.use("/api/user", authMiddleware, (req, res) => {
  res.status(200).send({ user: req.user });
});

//dashboard
import dashboardRoutes from "./routes/DashboardData.js";
app.use("/api/dashboard", authMiddleware, dashboardRoutes);

//file
import fileRoutes from "./routes/file.js";
app.use("/api/file", authMiddleware, fileRoutes);

//album
import albumRoutes from "./routes/album.js";
app.use("/api/album", authMiddleware, albumRoutes);

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log("Your server is running on port " + PORT);
});
