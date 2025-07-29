// src/components/Upload.jsx
import React, { useContext, useRef, useState } from "react";
import styles from "./Upload.module.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { RiFileImageFill, RiFilePdfFill, RiVideoFill } from "react-icons/ri";
import FileContext from "../../store/files/FileContext";
import { toast } from "react-toastify";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { fileActionDispatch } = useContext(FileContext);

  const uploadFile = (f, index) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const formData = new FormData();
    formData.append("files", f.file);

    // Update controller in file state
    const updatedFiles = [...files];
    updatedFiles[index].controller = controller;
    updatedFiles[index].status = "uploading";
    setFiles(updatedFiles);

    fetch(`${import.meta.env.VITE_API_URL}/file`, {
      method: "POST",
      body: formData,
      signal,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        updatedFiles[index].status = "success";
        updatedFiles[index].uploaded = parseFloat(updatedFiles[index].size); // Full uploaded
        setFiles([...updatedFiles]);
        console.log(data.files);
        fileActionDispatch({
          type: "ADD_FILE",
          payload: data.files,
        });
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          updatedFiles[index].status = "paused"; // Can resume
        } else {
          updatedFiles[index].status = "failed";
        }
        setFiles([...updatedFiles]);
      });
  };

  const handleFileSelect = (e) => {
    e.preventDefault();
    console.log("in select");
    console.log({ files });
    if (files.length) {
      console.log("in if");
      toast.info("Clear all files first", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    console.log("all files null");
    setFiles(null);

    const fileData = Array.from(e.target.files).map((file) => ({
      file,
      name: file.name,
      size: (file.size / 1048576).toFixed(2), // MB
      uploaded: 0,
      status: "pending", // 'uploading' | 'paused' | 'success' | 'failed' | 'cancelled'
      controller: null,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));
    console.log("all file set:", fileData);
    setFiles(fileData);
  };

  const handleDrop = (e) => {
    if (files) {
      toast.info("Clear all files first", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    setFiles(null);

    e.preventDefault();
    setDragActive(false);
    // processFiles(Array.from(e.dataTransfer.files));
    const fileData = Array.from(e.dataTransfer.files).map((file) => ({
      file,
      name: file.name,
      size: (file.size / 1048576).toFixed(2), // MB
      uploaded: 0,
      status: "pending", // 'uploading' | 'paused' | 'success' | 'failed' | 'cancelled'
      controller: null,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    setFiles(fileData);
  };

  const resumeUpload = (index) => {
    const f = files[index];
    if (f.status === "paused") {
      uploadFile(f, index);
    }
  };

  const pauseUpload = (index) => {
    const f = files[index];
    if (f.controller) {
      f.controller.abort();
    }
  };

  const cancelUpload = (index) => {
    setFiles((prev) => {
      const updated = [...prev];
      const f = updated[index];
      if (f.controller) f.controller.abort();
      updated[index].status = "cancelled";
      return updated;
    });
  };

  const cancelAllUpload = () => {
    files.forEach((f) => {
      if (f.controller) f.controller.abort();
    });
    console.log("all file clear");
    setFiles((prev) => (prev = []));
  };

  const removeFile = (i) => {
    setFiles((prev) => {
      const copy = [...prev];
      if (copy[i].preview) URL.revokeObjectURL(copy[i].preview);
      copy.splice(i, 1);
      return copy;
    });
  };

  const iconFor = (type) => {
    if (type === "image") return <RiFileImageFill />;
    if (type === "pdf") return <RiFilePdfFill />;
    if (type === "video") return <RiVideoFill />;
    return <RiFilePdfFill />;
  };

  return (
    <div className={styles.uploadContainer}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 text-white">Upload Files</h4>
        <div className="form-check form-switch text-white">
          <input
            className="form-check-input"
            type="checkbox"
            id="publicSwitch"
          />
          <label
            className="form-check-label"
            htmlFor="publicSwitch"
            style={{ paddingRight: "10px" }}
          >
            Make files public
          </label>
        </div>
      </div>

      <div className={styles.mainUploadContainer}>
        {/* Drop Zone */}
        <div
          className={`${styles.uploadArea} ${dragActive ? styles.active : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <FaCloudUploadAlt className={styles.uploadIcon} />
          <p>Drag & drop files here or click to browse</p>
          <small>Max size 100MB – JPG, PNG, PDF, MP4 supported</small>
        </div>

        {/* Sidebar options */}
        <div className={styles.sidebarOptions}>
          <div className="form-check form-switch text-white mb-2">
            {/* <input
              className="form-check-input"
              type="checkbox"
              id="assignAlbum"
            /> */}
            {/* <label className="form-check-label" htmlFor="assignAlbum">
              Assign to Album
            </label> */}
          </div>
          <div className="mb-2">
            <strong className="text-white">File types</strong>
            <div className="mt-1">
              <span className={styles.tag}>Images</span>
              <span className={styles.tag}>PDFs</span>
              <span className={styles.tag}>Videos</span>
            </div>
          </div>
          <div className="mb-3">8.2 GB of 10 GB remaining</div>
          <div className="form-check form-switch text-white mb-3">
            <input className="form-check-input" type="checkbox" id="autoTag" />
            <label className="form-check-label" htmlFor="autoTag">
              Auto-tag files
            </label>
          </div>
          <button
            className="btn btn-primary w-100 mb-2"
            onClick={() => {
              if (files.length > 0) {
                files.forEach((f, i) => {
                  if (f.status === "pending") {
                    uploadFile(f, i);
                  }
                });
              }
            }}
          >
            {" "}
            Upload Now
          </button>
          <button
            className="btn btn-outline-secondary w-100"
            onClick={cancelAllUpload}
          >
            Cancel All
          </button>
        </div>

        {/* Queue */}
        <div className={styles.uploadQueue}>
          {!files
            ? ""
            : files.map((f, i) => {
                const pct = Math.min(
                  100,
                  (f.uploaded / parseFloat(f.size)) * 100
                );
                return (
                  <div className={styles.fileRow} key={i}>
                    {f.preview ? (
                      <img
                        src={f.preview}
                        className={styles.imageThumb}
                        alt=""
                      />
                    ) : (
                      <div className={styles.fileIcon}>{iconFor(f.type)}</div>
                    )}
                    <div className={styles.fileInfo}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-white">{f.name}</span>
                        <div className="d-flex gap-2 align-items-center">
                          {f.status === "success" && (
                            <BsCheckCircle color="#00ff99" />
                          )}
                          {f.status === "failed" && (
                            <BsXCircle color="#ff4d4d" />
                          )}

                          {/* Pause Button */}
                          {f.status === "uploading" && (
                            <button
                              className={styles.controlBtn}
                              onClick={() => pauseUpload(i)}
                            >
                              Pause
                            </button>
                          )}

                          {/* Resume Button */}
                          {f.status === "paused" && (
                            <button
                              className={styles.controlBtn}
                              onClick={() => resumeUpload(i)}
                            >
                              Resume
                            </button>
                          )}

                          {/* Cancel Button */}
                          {f.status !== "success" &&
                            f.status !== "cancelled" && (
                              <button
                                className={styles.controlBtn}
                                onClick={() => cancelUpload(i)}
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </div>

                      <div className={styles.progressBar}>
                        <div
                          className={`${styles.progress} ${
                            f.status === "success"
                              ? styles.success
                              : f.status === "failed"
                              ? styles.failed
                              : ""
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <small className="text-muted">
                        {f.uploaded.toFixed(2)} MB / {f.size}
                      </small>
                    </div>

                    {/* Optional hard delete UI */}
                    <MdCancel
                      className={styles.cancelIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                    />
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
