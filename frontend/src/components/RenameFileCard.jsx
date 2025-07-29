import React, { useState } from "react";
import styles from "./RenameFileCard.module.css";
import { FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

export default function RenameFileCard({ file, onRename, onCancel }) {
  const fileNameParts = file.name.split(".");
  const extension = fileNameParts.length > 1 ? `.${fileNameParts.pop()}` : "";
  const baseName = fileNameParts.join(".");

  const [newName, setNewName] = useState(baseName);

  const handleSave = async () => {
    if (newName.trim() && newName !== baseName) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/file/${file._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newName.trim() + extension }),
            credentials: "include",
          }
        );
        if (!res.ok) {
          alert("Error renaming file");
          return;
        }
        onRename(file._id, newName.trim() + extension);
        toast.success("File renamed successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } catch (error) {
        alert("Error renaming file");
      }
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.includes(".")) {
      alert("Dots are not allowed in the file name.");
    }
    const valueWithoutDots = inputValue.replace(/\./g, "");
    setNewName(valueWithoutDots);
  };

  return (
    <div className={styles.card} onClick={(e) => e.stopPropagation()}>
      <h3 className={styles.title}>Rename File</h3>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={newName}
          onChange={handleChange}
          className={styles.input}
        />
        <span className={styles.extension}>{extension}</span>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.saveBtn}
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
        >
          <FaSave /> Save
        </button>
        <button className={styles.cancelBtn} onClick={onCancel}>
          <FaTimes /> Cancel
        </button>
      </div>
    </div>
  );
}
