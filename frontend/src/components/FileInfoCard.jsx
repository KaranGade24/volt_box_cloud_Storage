import React from "react";
import { FaDownload, FaFileAlt, FaStar, FaTags } from "react-icons/fa";
import styles from "./FileInfoCard.module.css";

export default function FileInfoCard({ file }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <FaFileAlt size={28} />
      </div>

      <div className={styles.info}>
        <h4 className={styles.name}>{file.name || "Unnamed File"}</h4>

        <p className={styles.meta}>
          <span>{file.size}</span> ·
          <span>{file.type || file.mimeType || "Unknown type"}</span> ·
          <span>
            {file.createdAt
              ? new Date(file.createdAt).toLocaleDateString()
              : "Unknown date"}
          </span>
        </p>

        {file.tags && file.tags.length > 0 && (
          <p className={styles.tags}>
            <FaTags style={{ marginRight: "6px" }} />
            {file.tags.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
