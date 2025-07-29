import React, { useState, useEffect } from "react";
import styles from "./ChooseFromExistingModal.module.css";
import ChooseFromExistingCard from "./ChooseFromExistingCard";

export default function ChooseFromExistingModal({
  files = [],
  defaultSelected = [],
  onClose,
  onDone,
}) {
  const [selectedIds, setSelectedIds] = useState(defaultSelected);

  const toggleFileSelect = (file) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(file.id)
        ? prevSelected.filter((id) => id !== file.id)
        : [...prevSelected, file.id]
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Select Files from Existing</h3>
        <div className={styles.fileGrid}>
          {files.map((file) => (
            <ChooseFromExistingCard
              key={file.id}
              file={file}
              isSelected={selectedIds.includes(file.id)}
              onToggleSelect={toggleFileSelect}
            />
          ))}
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
