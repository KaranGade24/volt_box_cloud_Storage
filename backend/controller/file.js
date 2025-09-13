import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import path from "path";
import File from "../model/file.js";
import cloudinary from "../utils/cloudinary.js";

const formatFileSize = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};
function getFileType(extension = "") {
  const ext = extension.split(".").pop().toLowerCase();

  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "svg":
      return "image";

    case "mp4":
    case "mkv":
    case "avi":
    case "mov":
    case "webm":
      return "video";

    case "mp3":
    case "wav":
    case "flac":
    case "aac":
      return "audio";

    case "pdf":
    case "doc":
    case "docx":
    case "xls":
    case "xlsx":
    case "ppt":
    case "pptx":
    case "txt":
      return "file";

    case "zip":
    case "rar":
    case "7z":
      return "archive";

    default:
      return "unknown";
  }
}

// ✅ Upload One or Multiple Files

export const uploadFiles = async (req, res) => {
  try {
    const files = req.files || [req.file];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    console.log("uploadedby: ", req.user.id);
    console.log("albumId: ", req.body.albumId);

    const results = [];

    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer, file.mimetype);
      const newFile = await File.create({
        name: file.originalname,
        url: result.secure_url,
        type: getFileType(path.extname(file.originalname)),
        size: formatFileSize(file.size),
        extension: path.extname(file.originalname),
        uploadedBy: req.user.id,
        cloudinaryId: result.public_id,
        albumId: req.body.albumId || null,
      });
      results.push(newFile);
    }
    console.log("Upload results:", { results });
    res
      .status(200)
      .json({ message: "Files uploaded successfully", files: results });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "File upload failed." });
  }
};

// ✅ Get All Files for Current User

export const getUserFiles = async (req, res) => {
  try {
    // Pagination parameters (defaults)
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(
      1,
      Math.min(10, parseInt(req.query.limit, 10) || 10)
    );
    const albumId = req.query.albumId;
    const isAlbumId = albumId !== "null" ? true : false;

    // console.log("Fetching files for user:", req.user.id);
    // console.log("Pagination parameters:", {
    //   page,
    //   limit,
    //   albumId,
    // });

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Fetch files for this user

    const files = await File.find(
      isAlbumId
        ? { albumId: mongoose.Types.ObjectId(albumId) }
        : { uploadedBy: mongoose.Types.ObjectId(req.user.id), albumId: null } // files not in any album
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10)
      .lean();

    // Count total for pagination
    const totalFiles = await File.countDocuments(
      isAlbumId
        ? { albumId: mongoose.Types.ObjectId(albumId) }
        : { uploadedBy: mongoose.Types.ObjectId(req.user.id), albumId: null } // files not in any album
    );

    const totalPages = Math.ceil(totalFiles / limit);

    console.log(
      `Fetched ${files.length} files for user${req.user.id}`,
      req.user.id
    );

    console.log("Pagination results:", {
      page,
      limit,
      totalFiles,
      totalPages,
      files,
    });
    // Send response
    return res.status(200).json({
      message: "Files fetched successfully",
      page,
      limit,
      totalFiles,
      totalPages,
      files,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch files", error: error.message });
  }
};

// ✅ Get File by ID
export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });
    console.log("Fetched file:", file);
    res.status(200).json(file);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Error fetching file" });
  }
};

// ✅ Delete File (DB + Cloudinary)
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    await cloudinary.uploader.destroy(file.cloudinaryId, {
      resource_type: file.type === "video" ? "video" : "auto",
    });
    console.log("Deleted file from Cloudinary:", file.cloudinaryId);
    await File.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete file" });
  }
};

// ✅ Update File Info or Replace File
export const updateFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    console.log(fileId);
    const existingFile = await File.findById(fileId);
    if (!existingFile)
      return res.status(404).json({ message: "File not found" });

    // Replace file (if new file is uploaded)
    if (req.file) {
      // Delete old file from Cloudinary
      await cloudinary.uploader.destroy(existingFile.cloudinaryId, {
        resource_type: existingFile.type === "video" ? "video" : "auto",
      });

      // Upload new file
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype
      );
      existingFile.url = result.secure_url;
      existingFile.type = result.resource_type;
      existingFile.size = formatFileSize(req.file.size);
      existingFile.extension = path.extname(req.file.originalname);
      existingFile.cloudinaryId = result.public_id;
      existingFile.name = req.file.originalname;
    }

    // Update metadata (name, albumId)
    if (req.body.name) existingFile.name = req.body.name;
    if (req.body.albumId !== undefined) existingFile.albumId = req.body.albumId;

    await existingFile.save();

    console.log("Updated file:", existingFile);

    res
      .status(200)
      .json({ message: "File updated successfully", file: existingFile });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update file" });
  }
};
