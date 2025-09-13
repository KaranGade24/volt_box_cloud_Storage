import File from "../model/file.js";

// Utility: parse "2.3 MB" → bytes
const parseSizeToBytes = (sizeStr) => {
  if (!sizeStr) return 0;
  const units = ["B", "KB", "MB", "GB", "TB"];
  const [value, unit] = sizeStr.split(" ");
  const num = parseFloat(value);
  const index = units.indexOf(unit.toUpperCase());
  return num * Math.pow(1024, index);
};

// Utility: format bytes → "X.Y GB"
const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export const getDashboardData = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });

    // ===== Storage overview =====
    const totalUsedBytes = files.reduce(
      (sum, file) => sum + parseSizeToBytes(file.size),
      0
    );
    // const totalAvailableBytes = 10 * 1024 * 1024 * 1024; // 10 GB quota

    const totalAvailableBytes = 100 * 1024 * 1024; // 100 MB quota

    const storage = {
      used: formatBytes(totalUsedBytes),
      total: formatBytes(totalAvailableBytes),
      percent: ((totalUsedBytes / totalAvailableBytes) * 100).toFixed(2),
    };

    // ===== Recent uploads =====
    const recentUploads = files.slice(0, 7).map((file) => ({
      _id: file._id,
      type: file.type,
      url: file.url,
      name: file.name,
      extension: file.extension,
    }));

    // ===== Stats by category =====
    let fileBytes = 0;
    let imageBytes = 0;
    let videoBytes = 0;
    let otherBytes = 0;

    files.forEach((file) => {
      const bytes = parseSizeToBytes(file.size);
      if (file.type === "image") {
        imageBytes += bytes;
      } else if (file.type === "video") {
        videoBytes += bytes;
      } else if ([".pdf", ".txt"].includes(file.extension)) {
        fileBytes += bytes;
      } else {
        otherBytes += bytes;
      }
    });

    const stats = [
      { type: "file", value: formatBytes(fileBytes) },
      { type: "image", value: formatBytes(imageBytes) },
      { type: "video", value: formatBytes(videoBytes) },
      { type: "other", value: formatBytes(otherBytes) },
    ];

    console.log("Dashboard data:", {
      storage,
      recentUploads,
      stats,
      files, // optional: send all
    });

    res.json({
      storage,
      recentUploads,
      stats,
      files, // optional: send all
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ error: "Server error" });
  }
};
