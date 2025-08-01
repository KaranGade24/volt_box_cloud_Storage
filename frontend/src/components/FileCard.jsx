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
  FaEllipsisH,
  FaDownload,
  FaTrash,
  FaSearch,
  FaInfoCircle,
  FaFolderOpen,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import RenameFileCard from "./RenameFileCard";
import FileInfoCard from "./FileInfoCard";

const handleDownload = (file) => window.open(file.url, "_blank");

function getIcon(type) {
  switch (type) {
    case "pdf":
      return <FaFilePdf />;
    case "jpg":
    case "png":
      return <FaFileImage />;
    case "docx":
      return <FaFileWord />;
    case "txt":
      return <FaFileAlt />;
    case "mp4":
      return <FaFileVideo />;
    case "zip":
      return <FaFileArchive />;
    case "pptx":
      return <FaFileCode />;
    default:
      return <FaFileAlt />;
  }
}

function FileCard({
  file,
  index,
  menuRef,
  activeMenu,
  setActiveMenu,
  Dispatch,
  activeInfoId,
  setActiveInfoId,
  activeRenameId,
  setActiveRenameId,
  setShowPreview,
  setPreviewIndex,
  AlbumId,
}) {
  return (
    <div
      onClick={() => {
        setShowPreview(true);
        setPreviewIndex(index);
      }}
      key={file._id}
      className={styles.fileCard}
    >
      <div
        tabIndex={1}
        onBlur={() => {
          setActiveMenu(null);
          setActiveInfoId(null);
        }}
        className={styles.fileActions}
      >
        <FaEllipsisH
          onClick={(e) => {
            e.stopPropagation();
            setActiveMenu((prev) => (prev === file._id ? null : file._id));
            setActiveRenameId(null);
            setActiveInfoId(null);
          }}
          style={{ color: activeMenu === file._id ? "#00bfff" : "#aaa" }}
        />
        {activeMenu === file._id && (
          <div ref={menuRef} className={styles.dropdownMenu}>
            <div onClick={() => handleDownload(file)}>
              <FaDownload /> Download
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveInfoId((id) => (id === file._id ? null : file._id));
                setActiveRenameId(null);
              }}
            >
              <FaInfoCircle /> File Info
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveRenameId((id) => (id === file._id ? null : file._id));
                setActiveInfoId(null);
              }}
            >
              <FaEdit /> Rename
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveInfoId(null);
                setActiveRenameId(null);
                Dispatch({
                  type: "DELETE_FILE",
                  payload: { fileId: file._id },
                });
              }}
            >
              <FaTrash /> Delete
            </div>
          </div>
        )}
      </div>

      {activeInfoId === file._id && <FileInfoCard file={file} />}
      {activeRenameId === file._id && (
        <RenameFileCard
          file={file}
          onRename={(id, newName) => {
            Dispatch({
              type: "RENAME_FILE",
              payload: {
                fileId: id,
                newName,
                AlbumId: AlbumId ? AlbumId : null,
              },
            });
            setActiveRenameId(null);
          }}
          onCancel={(e) => {
            e.stopPropagation();
            setActiveRenameId(null);
          }}
        />
      )}

      <div className={styles.icon}>{getIcon(file.type)}</div>
      <div className={styles.fileName}>{file.name}</div>
      <div className={styles.fileMeta}>
        <span>{file.size}</span>
      </div>
    </div>
  );
}

export default FileCard;
