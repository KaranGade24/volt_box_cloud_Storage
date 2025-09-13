import React, { useState, useEffect, useContext } from "react";
import styles from "./ChooseFromExistingModal.module.css";
import ChooseFromExistingCard from "./ChooseFromExistingCard";
import FileContext from "../store/files/FileContext";
import { FaSpinner } from "react-icons/fa";

export default function ChooseFromExistingModal({
  files = [],
  defaultSelected = [],
  onClose,
  onDone,
}) {
  const [selectedIds, setSelectedIds] = useState(defaultSelected);
  const [hasMore, setHasMore] = useState(true);
  const [currectPage, setCurrentPage] = useState(2);
  const [loagindMore, setLoagindMore] = useState(false);
  const { loading, fetchFiles } = useContext(FileContext);

  const handleFetchFile = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      // ✅ Make sure to await the async fetchFiles function
      setLoagindMore(true);
      const data = await fetchFiles(currectPage, 10, signal, setLoagindMore);
      setLoagindMore(false);
      if (!data) return;

      // ✅ data should now have the result
      setHasMore(currectPage < data.totalPages ? true : false);
      if (hasMore) {
        setCurrentPage(currectPage + 1);
      }

      return data; // optional, if you want to use it elsewhere
    } catch (err) {
      if (err.name === "AbortError") {
      } else {
        console.error("Error fetching files:", err);
      }
      return null;
    }
  };

  const toggleFileSelect = (file) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(file._id)
        ? prevSelected.filter((id) => id !== file._id)
        : [...prevSelected, file._id]
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Select Files from Existing</h3>
        <div className={styles.fileGrid}>
          {files.map((file, index) => (
            <ChooseFromExistingCard
              key={index}
              file={file}
              isSelected={selectedIds.includes(file._id)}
              onToggleSelect={toggleFileSelect}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
            position: "relative",
            bottom: "20px",
            alignSelf: "center",
            padding: "10px 20px",
          }}
        >
          <button
            style={{ padding: "10px 20px", width: "100%" }}
            disabled={!hasMore}
            onClick={handleFetchFile}
          >
            {loading || loagindMore ? (
              <>
                Loading files... <FaSpinner speed={1} />{" "}
              </>
            ) : hasMore ? (
              "Load More"
            ) : null}
            {!hasMore && (
              <h4
                style={{
                  color: "#aaa",
                  wordBreak: "break-all",
                  fontSize: "20px",
                  textAlign: "center",
                  fontWeight: "700",
                }}
              >
                {" "}
                No more files to load{" "}
              </h4>
            )}
          </button>
        </div>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button
            onClick={() => onDone(selectedIds)}
            className={styles.doneBtn}
          >
            Done ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}
