import React from "react";
import styles from "./FileStats.module.css";
import {
  FaFileAlt,
  FaFileImage,
  FaFileVideo,
  FaFileArchive,
} from "react-icons/fa";

function FileStats() {
  const stats = [
    {
      icon: <FaFileAlt />,
      label: "Files",
      value: "1.2 GB",
      active: true,
    },
    {
      icon: <FaFileImage />,
      label: "Images",
      value: "3.2 GB",
      active: true,
    },
    {
      icon: <FaFileVideo />,
      label: "Videos",
      value: "820 MB",
      active: true,
    },
    {
      icon: <FaFileArchive />,
      label: "Other",
      value: "480 MB",
      active: true,
    },
  ];

  return (
    <div className={styles.container}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${styles.statCard} ${stat.active ? styles.active : ""}`}
        >
          <div className={styles.icon}>{stat.icon}</div>
          <div className={styles.value}>{stat.value}</div>
          <div className={styles.label}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default FileStats;
