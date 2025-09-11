import React from "react";
import styles from "./FileStats.module.css";
import {
  FaFileAlt,
  FaFileImage,
  FaFileVideo,
  FaFileArchive,
} from "react-icons/fa";

function FileStats({ dashboardData }) {
  // Map type → icon + label
  const iconMap = {
    file: { icon: <FaFileAlt />, label: "Files" },
    image: { icon: <FaFileImage />, label: "Images" },
    video: { icon: <FaFileVideo />, label: "Videos" },
    other: { icon: <FaFileArchive />, label: "Other" },
  };

  return (
    <div className={styles.container}>
      {dashboardData?.stats?.map((stat, index) => {
        const mapped = iconMap[stat.type] || {
          icon: <FaFileAlt />,
          label: stat.type,
        };
        return (
          <div key={index} className={`${styles.statCard} ${styles.active}`}>
            <div className={styles.icon}>{mapped.icon}</div>
            <div className={styles.value}>{stat.value}</div>
            <div className={styles.label}>{mapped.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export default FileStats;
