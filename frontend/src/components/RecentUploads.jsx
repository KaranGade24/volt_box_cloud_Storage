import React from "react";
import { FaFilePdf, FaPlay, FaPlus } from "react-icons/fa";
import styles from "./RecentUploads.module.css";

const uploads = [
  { type: "img", src: "https://picsum.photos/id/1015/200" },
  { type: "pdf" },
  { type: "img", src: "https://picsum.photos/id/1025/200" },
  { type: "img", src: "https://picsum.photos/id/1035/200" },
  { type: "img", src: "https://picsum.photos/id/1045/200" },
  { type: "img", src: "https://picsum.photos/id/1055/200" },
  { type: "img", src: "https://picsum.photos/id/1065/200" },
  { type: "video" },
];

export default function RecentUploads() {
  return (
    <div className={styles.card}>
      <div className={styles.title}>Recent Uploads</div>
      <div className={styles.grid}>
        {uploads.map((file, i) => (
          <div className={styles.item} key={i}>
            {file.type === "img" && <img src={file.src} alt="" />}
            {file.type === "pdf" && (
              <div className={styles.pdf}>
                <FaFilePdf size={32} />
                <span>PDF</span>
              </div>
            )}
            {file.type === "video" && (
              <>
                <div className={styles.videoThumb} />
                <div className={styles.playOverlay}>
                  <FaPlay size={18} />
                </div>
              </>
            )}
            {i === uploads.length - 1 && (
              <div className={styles.explore}>
                <FaPlus size={18} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
