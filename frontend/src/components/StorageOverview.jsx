import React, { useEffect, useState } from "react";
import styles from "./StorageOverview.module.css";
import { useNavigate } from "react-router-dom";

// Utility: convert "2.3 MB" → bytes
const parseSizeToBytes = (sizeStr) => {
  if (!sizeStr) return 0;
  const units = ["B", "KB", "MB", "GB", "TB"];
  const [value, unit] = sizeStr.split(" ");
  const num = parseFloat(value);
  const index = units.indexOf(unit.toUpperCase());
  return num * Math.pow(1024, index);
};

export default function StorageOverview({ used, total, percentage }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(percentage);
  useEffect(() => {
    setTimeout(() => setProgress(percentage), 100);
  }, [percentage, used, total]);

  function progressColor(percent) {
    if (percent <= 25) return "#43a047"; // green
    if (percent <= 50) return "#fdd835"; // yellow
    if (percent <= 75) return "#fb8c00"; // orange
    return "#e53935"; // red
  }

  return (
    <div className={styles.card}>
      <div className={styles.title}>Storage Overview</div>
      <div className={styles.body}>
        <div className={styles.circleWrapper}>
          <div
            className={styles.progress}
            style={{
              background: `conic-gradient(
          ${progressColor(progress)} ${progress}%,
          var(--secondary-bg, #222) ${progress}%
        )`,
            }}
          >
            <div className={styles.inner}>
              <span>{used}</span>
            </div>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.used}>{used}</div>
          <div className={styles.total}>of {total} used</div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          navigate("/upload");
        }}
        className={styles.button}
      >
        Upload New File
      </button>
    </div>
  );
}
