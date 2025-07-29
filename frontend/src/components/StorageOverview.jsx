import React, { useEffect, useState } from "react";
import styles from "./StorageOverview.module.css";

export default function StorageOverview({ used, total }) {
  const percent = Math.round((used / total) * 100);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // trigger the CSS gradient animation
    setTimeout(() => setProgress(percent), 100);
  }, [percent]);

  return (
    <div className={styles.card}>
      <div className={styles.title}>Storage Overview</div>
      <div className={styles.body}>
        <div className={styles.circleWrapper}>
          <div
            className={styles.progress}
            style={{
              background: `conic-gradient(var(--primary) ${progress}%, var(--secondary-bg) ${progress}%)`,
            }}
          >
            <div className={styles.inner}>
              <span>{used} GB</span>
            </div>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.used}>{used} GB</div>
          <div className={styles.total}>of {total} GB used</div>
        </div>
      </div>
      <button className={styles.button}>Upload New File</button>
    </div>
  );
}
