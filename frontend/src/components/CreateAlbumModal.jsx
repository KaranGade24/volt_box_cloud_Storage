import React, { useContext, useEffect, useState } from "react";
import styles from "./CreateAlbumModal.module.css";
import { FaTimes, FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { VoltboxSymbol } from "./VotBoxLogo";
import { v4 as uniqueIdGenerator } from "uuid";
import FileContext from "../store/files/FileContext";
import ChooseFromExistingModal from "./ChooseFromExistingModal";
import AlbumContext from "../store/Albums/AlbumContex";
import axios from "axios";

export default function CreateAlbumModal({ onClose }) {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [visibility, setVisibility] = useState("Private");
  const [showModal, setShowModal] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const { files } = useContext(FileContext);
  const { AlbumDispatch, Albums, getDashboardData, dashboardData } =
    useContext(AlbumContext);
  const [loading, setLoading] = useState(false);

  const parseSize = (sizeStr) => {
    if (!sizeStr) return 0;
    const [val, unit] = sizeStr.split(" ");
    const num = parseFloat(val);
    const units = { Bytes: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
    return num * (units[unit] || 1);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " Bytes";
    if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(2) + " MB";
    return (bytes / 1024 ** 3).toFixed(2) + " GB";
  };

  useEffect(() => {
    setExistingFiles(files);
  }, [files]);

  const handleCoverPhotoUpload = (coverPhoto) => {
    setCoverPhoto(coverPhoto);
  };

  const handleCreateAlbumClick = async () => {
    // Check if album name is provided
    if (!albumName) {
      alert("Album name is required");
      return;
    }

    if (Albums.find((album) => album.name === albumName))
      return alert("Album name already exists use another name");

    if (uploadFiles.length === 0 && selectedFileIds.length === 0) {
      alert("Please select or upload at least one file");
      return;
    }

    try {
      setLoading(true);
      // Create FormData (for file uploads)
      const formData = new FormData();

      // Case 1: Upload new files
      if (uploadFiles.length > 0) {
        uploadFiles.forEach((file) => {
          formData.append("files", file); // backend => req.files
        });
      }

      // Case 2: Existing files
      if (selectedFileIds.length > 0) {
        selectedFileIds.forEach((id) => {
          formData.append("existingFileIds[]", id); // backend => req.body.existingFileIds
        });
      }

      // Album metadata
      formData.append("name", albumName);
      formData.append("accessControl", visibility); // "private" | "public" | "shared"
      formData.append("tags", selectedTags.join(","));

      // Cover image (single file)
      if (coverPhoto) {
        formData.append("coverImage", coverPhoto); // backend => req.file
      }

      // Send request
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/album`,
        formData,
        { withCredentials: true }
      );

      if (res.status === 201) {
        console.log(
          `Album created with ID: ${res.data.album._id} files that attached: ${res.data.files}`,
          res
        );
        // Dispatch with backend response
        const payload = {
          id: uniqueIdGenerator(),
          _id: res?.data?.album?._id,
          name: res?.data?.album?.name ? res?.data?.album?.name : albumName,
          cover: res?.data?.album?.coverImage
            ? res?.data?.album?.coverImage?.url
            : null,
          tags: res?.data?.album?.tags ? res?.data?.album?.tags : [],
          visibility: res?.data?.album?.accessControl || "private",
          files: res?.data?.files || [],
          originalFiles: res?.data?.files || [],
        };
        AlbumDispatch({
          type: "CREATE_ALBUM",
          payload: payload, // contains _id, name, etc.
        });

        getDashboardData();
        onClose();
      }
    } catch (error) {
      console.error("Error creating album:", error);
      alert("Failed to create album");
    } finally {
      setUploadFiles([]);
      setCoverPhoto(null);
      setSelectedTags([]);
      setAlbumName("");
      setVisibility("Private");
      setSelectedFileIds([]);
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <span>
            <VoltboxSymbol />
          </span>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Title */}
        <div className={styles.titleSection}>
          <h2>Create New Album</h2>
          <p>Organize your files into a dedicated album</p>
        </div>

        {/* Content */}

        <div className={styles.content}>
          {/* Album Details */}
          <div className={styles.section}>
            <label>Album Name</label>
            <input
              type="text"
              placeholder="e.g. Travel 2025"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
            />

            {/* <label>Description</label>
            <textarea placeholder="Add an optional description..." /> */}

            <label>Cover Photo</label>
            <div className={styles.coverRow}>
              <label className={styles.coverBtn}>
                {coverPhoto ? (
                  <img
                    src={URL.createObjectURL(coverPhoto)}
                    alt="Cover"
                    className={styles.coverPreviewImg}
                  />
                ) : (
                  <IoMdAdd />
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    handleCoverPhotoUpload(e.target.files[0]);
                    console.log(coverPhoto);
                  }}
                />
              </label>
            </div>

            <div>
              <button
                className={styles.selectBtn}
                onClick={(e) => {
                  if (uploadFiles.length > 0) {
                    e.preventDefault();
                    alert(
                      "You cannot select existing files when you've already uploaded new files."
                    );
                  } else {
                    setShowModal(true);
                  }
                }}
              >
                Select Existing Files
              </button>

              {/* Show selected file info */}
              {selectedFileIds.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <h4>Selected Files:</h4>
                  <ul
                    style={{
                      paddingLeft: "20px",
                      height: "100px",
                      overflowY: "auto",
                    }}
                  >
                    {existingFiles
                      .filter((file) => selectedFileIds.includes(file._id))
                      .map((file) => (
                        <li key={file._id}>
                          {file.name} — {file.size}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {showModal && (
                <ChooseFromExistingModal
                  files={existingFiles}
                  defaultSelected={selectedFileIds}
                  onClose={() => setShowModal(false)}
                  onDone={(ids) => {
                    setSelectedFileIds(ids);
                    setShowModal(false);
                  }}
                />
              )}
            </div>
          </div>

          {/* Add Files & Settings */}
          <div className={styles.section}>
            <label
              onClick={(e) => {
                if (selectedFileIds.length > 0) {
                  e.preventDefault(); // Stop file picker from opening
                  alert(
                    "You cannot upload new files when you've selected from existing ones."
                  );
                }
              }}
              className={styles.dropZoneWrapper}
            >
              <span>Add Files</span>
              <input
                type="file"
                multiple
                className={styles.hiddenInput}
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files);

                  // Get usage info from dashboard
                  const usedBytes = parseSize(dashboardData?.storage?.used);
                  const totalBytes = parseSize(dashboardData?.storage?.total);

                  // Calculate sizes
                  const newFilesSize = newFiles.reduce(
                    (acc, f) => acc + f.size,
                    0
                  );
                  const alreadyAddedSize = uploadFiles.reduce(
                    (acc, f) => acc + f.size,
                    0
                  );
                  const remainingBytes =
                    totalBytes - usedBytes - alreadyAddedSize;

                  if (newFilesSize > remainingBytes) {
                    alert(
                      `Upload exceeds your available storage. You have ${formatSize(
                        remainingBytes
                      )} left.`
                    );
                    return;
                  }

                  // If within limit → add to state
                  setUploadFiles((prevFiles) => [...prevFiles, ...newFiles]);
                }}
              />

              <div className={styles.dropZone}>
                <FaCloudUploadAlt size={28} />
                <p>Drop files here or click to upload</p>
              </div>
            </label>

            {/* <label>Settings</label>
            <div className={styles.visibility}>
              <span
                className={visibility === "Private" ? styles.active : ""}
                onClick={() => setVisibility("Private")}
              >
                Private
              </span>
              <span
                className={visibility === "Public" ? styles.active : ""}
                onClick={() => setVisibility("Public")}
              >
                Public
              </span>
            </div> */}
            <br />
            <br />
            <div className={styles.tags}>
              <input
                type="text"
                placeholder="Add a tag (e.g. Travel)"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    const newTag = e.target.value.trim();
                    if (!selectedTags.includes(newTag)) {
                      setSelectedTags([...selectedTags, newTag]);
                    }
                    e.target.value = "";
                  }
                }}
              />

              <div className={styles.tags}>
                {selectedTags.map((tag, index) => (
                  <span key={`${index}${tag}`} className={styles.tag}>
                    {tag}
                    <span
                      className={styles.closeTag}
                      onClick={() =>
                        setSelectedTags((tags) => tags.filter((t) => t !== tag))
                      }
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={albumName ? styles.createBtn : styles.disabledBtn}
            disabled={!albumName || loading}
            onClick={() => handleCreateAlbumClick()}
          >
            {loading ? (
              <span>Creating Album...</span>
            ) : (
              <span>Create Album</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
