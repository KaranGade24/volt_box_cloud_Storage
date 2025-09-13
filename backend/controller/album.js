import Album from "../model/album.js";
import File from "../model/file.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import path from "path";

const formatFileSize = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

export const createAlbum = async (req, res) => {
  try {
    const { name, description, tags, accessControl, existingFileIds } =
      req.body;

    console.log({
      name,
      description,
      tags,
      accessControl,
      existingFileIds,
      files: req.files?.files,
      coverImage: req.files?.coverImage,
    });

    if (!name) {
      return res.status(400).json({ message: "Album name is required" });
    }

    const tagList = typeof tags === "string" ? tags.split(",") : tags || [];

    let coverImage = null;
    if (req.files?.coverImage?.[0]) {
      const cover = req.files.coverImage[0];
      const result = await uploadToCloudinary(cover.buffer, cover.mimetype);
      coverImage = {
        url: result.secure_url,
        cloudinaryId: result.public_id,
        type: result.resource_type,
        extension: path.extname(cover.originalname),
      };
    }

    const newAlbum = await Album.create({
      name,
      description,
      tags: tagList,
      accessControl: accessControl?.toLowerCase() || "private",
      createdBy: req.user.id,
      coverImage,
    });

    let attachedFiles = [];

    // Step 2A: Upload new files in parallel using Promise.all
    if (req.files?.files && req.files.files.length > 0) {
      const uploadedFiles = await Promise.all(
        req.files.files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer, file.mimetype);
          return File.create({
            name: file.originalname,
            url: result.secure_url,
            type: result.resource_type,
            size: formatFileSize(file.size),
            extension: path.extname(file.originalname),
            uploadedBy: req.user.id,
            cloudinaryId: result.public_id,
            albumId: newAlbum._id,
          });
        })
      );
      attachedFiles = attachedFiles.concat(uploadedFiles);
    }

    // Step 2B: Reassign existing file IDs
    if (existingFileIds && existingFileIds.length > 0) {
      await File.updateMany(
        { _id: { $in: existingFileIds }, uploadedBy: req.user.id },
        { $set: { albumId: newAlbum._id } }
      );

      const files = await File.find({ _id: { $in: existingFileIds } });
      attachedFiles = attachedFiles.concat(files);
    }

    console.log({
      message: "Album created successfully",
      album: newAlbum,
      files: attachedFiles,
    });

    return res.status(201).json({
      message: "Album created successfully",
      album: newAlbum,
      files: attachedFiles,
    });
  } catch (error) {
    console.error("Create album error:", error);
    res
      .status(500)
      .json({ message: "Failed to create album", error: error.message });
  }
};

export const getAlbums = async (req, res) => {
  try {
    // Get page and limit (defaults: page=1, limit=15)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    // Fetch albums created by the logged-in user with pagination
    console.log("Fetching albums for user:", req.user.id);
    const albums = await Album.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit)
      .lean();

    console.log("Albums fetched successfully", albums);

    // Populate files for each album
    const albumsWithFiles = await Promise.all(
      albums.map(async (album) => {
        const files = await File.find({ albumId: album._id })
          .limit(10)
          .skip(0)
          .lean();
        return { ...album, files };
      })
    );

    console.log("Albums with files:", albumsWithFiles);

    // Get total count for pagination info
    const totalAlbums = await Album.countDocuments({
      createdBy: req.user.id,
    });
    const totalPages = Math.ceil(totalAlbums / limit);

    console.log({
      message: "Albums fetched successfully",
      page,
      totalPages,
      totalAlbums,
      albums: albumsWithFiles,
    });

    return res.status(200).json({
      message: "Albums fetched successfully",
      page,
      totalPages,
      totalAlbums,
      albums: albumsWithFiles,
    });
  } catch (error) {
    console.error("Get albums error:", error);
    res.status(500).json({
      message: "Failed to fetch albums",
      error: error.message,
    });
  }
};
