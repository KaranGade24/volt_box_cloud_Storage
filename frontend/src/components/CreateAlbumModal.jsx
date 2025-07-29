import React, { useContext, useEffect, useState } from "react";
import styles from "./CreateAlbumModal.module.css";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { VoltboxSymbol } from "./VotBoxLogo";
import { v4 as uniqueIdGenerator } from "uuid";
import FileContext from "../store/files/FileContext";
import ChooseFromExistingModal from "./ChooseFromExistingModal";
import AlbumContext from "../store/Albums/AlbumContex";
import { formatFileSize } from "../store/files/FileReducer";

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
  const { AlbumDispatch } = useContext(AlbumContext);
  useEffect(() => {
    setExistingFiles(files);
  }, [files]);

  const handleCoverPhotoUpload = (e) => {
 
    if (formattedFiles.length > 0) {
      AlbumDispatch({
        type: "CREATE_ALBUM",
        payload: {
          id: uniqueIdGenerator(),
          name: albumName,
          cover: coverPhoto,
          tags: selectedTags,
          visibility: visibility,
          files: formattedFiles,
        },
      });
    } else {
      alert("Please select or upload at least one file.");
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
                  onChange={handleCoverPhotoUpload}
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
                      .filter((file) => selectedFileIds.includes(file.id))
                      .map((file) => (
                        <li key={file.id}>
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
                  const files = Array.from(e.target.files);
                  setUploadFiles((prevFiles) => [...prevFiles, ...files]);
                  console.log(uploadFiles);
                }}
                // onChange={handleFileUpload} // <- your custom function
              />
              <div className={styles.dropZone}>
                <FaCloudUploadAlt size={28} />
                <p>Drop files here or click to upload</p>
              </div>
            </label>

            <label>Settings</label>
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
            </div>

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
                {selectedTags.map((tag) => (
                  <span key={tag} className={styles.tag}>
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
            disabled={!albumName}
            onClick={() => handleCreateAlbumClick(files)}
          >
            Create Album
          </button>
        </div>
      </div>
    </div>
  );
}
