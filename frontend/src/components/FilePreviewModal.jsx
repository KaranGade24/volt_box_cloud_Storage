import React, { useState } from "react";
import styles from "./FilePreviewModal.module.css";
import { FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function FilePreviewModal({
  file, // single file
  files, // OR array of files
  initialIndex = 0,
  onClose,
}) {
  // Normalize into array
  const fileList = files || (file ? [file] : []);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentFile = fileList[currentIndex];

  if (!currentFile) return null; // nothing to show

  const getFileType = (extension) => {
    const ext = extension.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext))
      return "image";
    if (["pdf"].includes(ext)) return "pdf";
    if (["mp4", "webm", "ogg"].includes(ext)) return "video";
    return "other";
  };

  const handleDownload = async (file) => {
    const response = await fetch(file.url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = file.name; // force custom name
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const renderPreview = (file) => {
    const type = getFileType(file?.extension);
    if (type === "image") {
      return <img src={file.url} alt={file.name} className={styles.preview} />;
    }
    // if (type === "pdf") {
    //   return (
    //     <iframe
    //       src={file?.url}
    //       title={file.name}
    //       className={styles.preview}
    //     ></iframe>
    //   );
    // }
    if (type === "video") {
      return (
        <video controls className={styles.preview}>
          <source src={file.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <div className={styles.unknown}>
        <p>No preview available</p>
        <button onClick={() => handleDownload(file)}>
          Download {file.name}
        </button>
      </div>
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < fileList.length - 1 ? prev + 1 : prev));
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
        <div className={styles.header}>
          {fileList.length > 1
            ? `${currentIndex + 1}/${fileList.length}`
            : currentFile.name}
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.content}>{renderPreview(currentFile)}</div>

        {fileList.length > 1 && (
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
              className={styles.navBtn}
              disabled={currentIndex === fileList.length - 1}
            >
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
