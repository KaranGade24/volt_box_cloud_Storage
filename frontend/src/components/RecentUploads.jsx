import React from "react";
import { FaFilePdf, FaPlay, FaPlus } from "react-icons/fa";
import styles from "./RecentUploads.module.css";
import FilePreviewModal from "./FilePreviewModal";
import { useNavigate } from "react-router-dom";

export default function RecentUploads({ dashboardData }) {
  const [preview, setPreview] = React.useState(null);
  const uploads = dashboardData?.recentUploads || [];
  const navigate = useNavigate();

  const handleOpenPreview = (file) => {
    setPreview(file);
  };

  return (
    <div className={styles.card}>
      <div className={styles.title}>Recent Uploads</div>
      <div className={styles.grid}>
        {uploads.map((file, i) => (
          <div
            onClick={() => handleOpenPreview(file)}
            className={styles.item}
            key={file._id || i}
          >
            {/* Images */}
            {file.type === "image" && <img src={file.url} alt={file.name} />}

            {/* PDFs */}
            {file.type === "pdf" && (
              <div className={styles.pdf}>
                <FaFilePdf size={32} />
                <span>{file.extension?.toUpperCase() || "PDF"}</span>
              </div>
            )}

            {/* Videos */}
            {file.type === "video" && (
              <>
                <div className={styles.videoThumb}></div>
                <div className={styles.playOverlay}>
                  <FaPlay size={18} />
                </div>
              </>
            )}
          </div>
        ))}

        {/* Explore More card */}
        <div onClick={() => navigate("/myfiles")} className={styles.item}>
          <div className={styles.explore}>
            <FaPlus size={32} />
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {preview && (
        <FilePreviewModal
          file={preview} // ✅ send single file
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
