import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  deleteFile,
  getUserFiles,
  updateFile,
  uploadFiles,
} from "../controller/file.js";
const router = express.Router();

router.post("/:id", updateFile);
router.post("/", upload.array("files"), uploadFiles);
router.get("/", getUserFiles);
router.delete("/:fileId", deleteFile);

export default router;
