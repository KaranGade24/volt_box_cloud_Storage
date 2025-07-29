import React, { useState } from "react";
import styles from "./FilePreviewModal.module.css";
import { FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function FilePreviewModal({ files, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentFile = files[currentIndex];

  console.log({ currentFile });
  const getFileType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext))
      return "image";
    if (["pdf"].includes(ext)) return "pdf";
    if (["mp4", "webm", "ogg"].includes(ext)) return "video";
    return "other";
  };

  const renderPreview = (file) => {
    const type = getFileType(file.name);
    if (type === "image") {
      return <img src={file.url} alt={file.name} className={styles.preview} />;
    } else if (type === "pdf") {
      return (
        <iframe
          src={file.url}
          title={file.name}
          className={styles.preview}
          frameBorder="0"
        ></iframe>
      );
    } else if (type === "video") {
      return (
        <video controls className={styles.preview}>
          <source src={file.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <div className={styles.unknown}>
          <p>No preview available</p>
          <a href={file.url} download>
            Download {file.name}
          </a>
        </div>
      );
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? (prev = 0) : prev - 1));
  };

  const handleNext = (e) => {
    setCurrentIndex((prev) =>
      prev === files.length - 1 ? (prev = files.length - 1) : prev + 1
    );
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        handlePrev();
        break;
      case "ArrowRight":
        handleNext();
        break;
      case "Escape":
        onClose();
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.modalOverlay} tabIndex={0} onKeyDown={handleKeyDown}>
      <div className={styles.modal}>
        <div className={styles.header}>{`${currentIndex + 1}/${
          files.length
        }`}</div>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.content}>{renderPreview(currentFile)}</div>

        <div className={styles.footer}>
          <button
            onClick={handlePrev}
            className={styles.navBtn}
            disabled={currentIndex === 0}
          >
            <FaArrowLeft />
          </button>

          <span className={styles.filename}>{currentFile.name}</span>

          <button
            onClick={handleNext}
            onKeyDown={(e) => {
              console.log(e.key);
              if (e.key === "Enter" || e.key === " ") {
                handleNext();
              }
            }}
            className={styles.navBtn}
            disabled={currentIndex === files.length - 1}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
