import React from "react";
import styles from "../pages/MyFiles/MyFiles.module.css";
import {
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaFileVideo,
  FaFileArchive,
  FaFileWord,
  FaFileCode,
  FaCheckCircle,
} from "react-icons/fa";

// Function to return correct icon based on file type
function getIcon(type) {
  switch (type) {
    case "pdf":
      return <FaFilePdf />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FaFileImage />;
    case "docx":
    case "doc":
      return <FaFileWord />;
    case "txt":
      return <FaFileAlt />;
    case "mp4":
    case "avi":
      return <FaFileVideo />;
    case "zip":
    case "rar":
      return <FaFileArchive />;
    case "ppt":
    case "pptx":
      return <FaFileCode />;
    default:
      return <FaFileAlt />;
  }
}

// Component
export default function ChooseFromExistingCard({
  file,
  isSelected,
  onToggleSelect,
}) {
  return (
    <div
      className={`${styles.fileCard} ${isSelected ? styles.selectedCard : ""}`}
      onClick={() => onToggleSelect(file)}
    >
      {/* File Icon */}
      <div className={styles.icon}>{getIcon(file.type)}</div>

      {/* File Name */}
      <div className={styles.fileName}>{file.name}</div>

      {/* File Meta */}
      <div className={styles.fileMeta}>
        <span>{file.size}</span>
      </div>

      {/* Check Overlay if Selected */}
      {isSelected && (
        <div className={styles.checkOverlay}>
          <FaCheckCircle className={styles.checkIcon} />
        </div>
      )}
    </div>
  );
}
