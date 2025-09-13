import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Upload.module.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { RiFileImageFill, RiFilePdfFill, RiVideoFill } from "react-icons/ri";
import FileContext from "../../store/files/FileContext";
import { toast, ToastContainer } from "react-toastify";
import AlbumContext from "../../store/Albums/AlbumContex";

export default function Upload() {
  // const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const {
    fileActionDispatch,
    uploadFiles: files,
    setUploadFiles: setFiles,
    fetchFiles,
  } = useContext(FileContext);
  const { getDashboardData, dashboardData } = useContext(AlbumContext);
  const [loading, setLoading] = useState(false);

  const checkStatusToSetDefaultValue = () => {
    const allDone = files.every(
      (f) =>
        f.status === "success" || f.status === "failed" || f.status === "paused"
    );

    if (allDone) {
      const control = new AbortController();
      const signal = control.signal;
      // fileActionDispatch({ type: "ADD_FILES", payload: data.files });
      fetchFiles(1, 10, signal);
      getDashboardData();
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatusToSetDefaultValue();
  }, [files]);

  const uploadFile = (f, index) => {
    try {
      setLoading(true);

      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("files", f.file);

      // Set status immediately
      setFiles((prev) => {
        const copy = [...(prev || [])];
        copy[index] = {
          ...copy[index],
          status: "uploading",
          uploaded: 0,
          percent: 0,
          controller: xhr,
        };
        return copy;
      });

      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;
        const uploadedBytes = e.loaded;
        const totalBytes = e.total;
        const uploadedMB = uploadedBytes / 1048576; // MB
        const percent = Math.min(100, (uploadedBytes / totalBytes) * 100);

        setFiles((prev) => {
          const copy = [...(prev || [])];
          if (!copy[index]) return copy;
          copy[index] = {
            ...copy[index],
            uploaded: Number(uploadedMB.toFixed(2)),
            percent: Number(percent.toFixed(2)),
            status: "uploading",
            controller: xhr,
          };
          return copy;
        });
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);

          setFiles((prev) => {
            const copy = [...(prev || [])];
            if (!copy[index]) return copy;
            copy[index] = {
              ...copy[index],
              status: "success",
              uploaded: Number(copy[index].size),
              percent: 100,
            };
            return copy;
          });

          // Check if all files are finished
          checkStatusToSetDefaultValue();
        } else {
          setFiles((prev) => {
            const copy = [...(prev || [])];
            if (!copy[index]) return copy;
            copy[index] = { ...copy[index], status: "failed" };

            return copy;
          });

          // Same check on failure
          checkStatusToSetDefaultValue();
        }
      };

      xhr.onerror = () => {
        setFiles((prev) => {
          const copy = [...(prev || [])];
          if (!copy[index]) return copy;
          copy[index] = { ...copy[index], status: "failed" };
          return copy;
        });
        checkStatusToSetDefaultValue();
      };

      xhr.onabort = () => {
        setFiles((prev) => {
          const copy = [...(prev || [])];
          if (!copy[index]) return copy;
          copy[index] = { ...copy[index], status: "paused" };
          return copy;
        });
        checkStatusToSetDefaultValue();
      };

      xhr.open("POST", `${import.meta.env.VITE_API_URL}/file`, true);
      xhr.withCredentials = true;
      xhr.send(formData);
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      checkStatusToSetDefaultValue();
    }
  };

  const parseSize = (sizeStr) => {
    if (!sizeStr) return 0;
    const [val, unit] = sizeStr.split(" ");
    const num = parseFloat(val);
    const units = { Bytes: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
    return num * (units[unit] || 1);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " Bytes";
    if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(2) + " MB";
    return (bytes / 1024 ** 3).toFixed(2) + " GB";
  };

  const handleFileSelect = (e) => {
    e.preventDefault();
    if (files && files.length) {
      toast.info("Clear all files first", { theme: "dark" });
      return;
    }

    const selectedFiles = Array.from(e.target.files);

    // current usage
    const usedBytes = parseSize(dashboardData?.storage?.used);
    const totalBytes = parseSize(dashboardData?.storage?.total);
    const remainingBytes = totalBytes - usedBytes;
    // new files size
    const newSize = selectedFiles.reduce((acc, f) => acc + f.size, 0);

    if (usedBytes + newSize > totalBytes) {
      toast.error(
        `Upload exceeds your available storage. You have ${formatSize(
          remainingBytes
        )} left.`,
        {
          theme: "dark",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return;
    }

    const fileData = selectedFiles.map((file) => ({
      file,
      name: file.name,
      size: (file.size / 1048576).toFixed(2), // MB string for display
      sizeBytes: file.size,
      uploaded: 0,
      percent: 0,
      status: "pending",
      controller: null,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    setFiles(fileData);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    if (files && files.length) {
      toast.info("Clear all files first", { theme: "dark" });
      return;
    }

    const droppedFiles = Array.from(e.dataTransfer.files);

    const usedBytes = parseSize(dashboardData?.storage?.used);
    const totalBytes = parseSize(dashboardData?.storage?.total);
    const newSize = droppedFiles.reduce((acc, f) => acc + f.size, 0);
    const remainingBytes = totalBytes - usedBytes;

    if (usedBytes + newSize > totalBytes) {
      toast.error(
        `Upload exceeds your available storage. You have ${formatSize(
          remainingBytes
        )} left.`,
        {
          theme: "dark",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return;
    }

    const fileData = droppedFiles.map((file) => ({
      file,
      name: file.name,
      size: (file.size / 1048576).toFixed(2), // MB
      sizeBytes: file.size,
      uploaded: 0,
      percent: 0,
      status: "pending",
      controller: null,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    setFiles(fileData);
  };

  const pauseUpload = (index) => {
    const f = files[index];
    if (f.controller) {
      f.controller.abort(); // abort current upload
      const updated = [...files];
      updated[index].status = "paused";
      setFiles(updated);
    }
    checkStatusToSetDefaultValue();
  };

  const resumeUpload = (index) => {
    const f = files[index];
    if (f.status === "paused") {
      uploadFile(f, index); // restart
    }
  };

  const cancelUpload = (index) => {
    const updated = [...files];
    if (updated[index].controller) updated[index].controller.abort();
    updated[index].status = "cancelled";
    setFiles(updated);
    checkStatusToSetDefaultValue();
  };

  const cancelAllUpload = () => {
    if (!files || files.length === 0) return;
    files.forEach((f) => {
      if (f.controller && typeof f.controller.abort === "function") {
        f.controller.abort();
      }
    });
    setFiles([]); // clear list
    checkStatusToSetDefaultValue();
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
      <ToastContainer theme="dark" autoClose={5000} position="top-right" />
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
            {/* Make files public */}
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

          <div className="mb-3">
            {dashboardData !== null &&
              `${dashboardData?.storage?.used || 0} of
            ${dashboardData?.storage?.total || 0}  remaining`}
          </div>

          <button
            className="btn btn-primary w-100 mb-2"
            onClick={() => {
              if (files.length === 0) {
                toast.error("No files selected", {
                  theme: "dark",
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                return;
              }
              if (files.length > 0) {
                files.forEach((f, i) => {
                  if (f.status === "pending") {
                    uploadFile(f, i);
                  }
                });
              }
            }}
          >
            {loading ? "Uploading..." : "Upload Now"}
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
                          // style={{ width: `${pct}%` }}
                          style={{ width: `${f.percent ?? 0}%` }}
                        />
                      </div>

                      <small className="text-white">
                        {(f.uploaded ?? 0).toFixed(2)} MB / {f.size} MB
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
