import express from "express";
import { createAlbum, getAlbums } from "../controller/album.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "files", maxCount: 20 }, // multiple user-uploaded files
    { name: "coverImage", maxCount: 1 }, // single cover image
  ]),
  createAlbum
);

router.get("/", getAlbums);

export default router;
