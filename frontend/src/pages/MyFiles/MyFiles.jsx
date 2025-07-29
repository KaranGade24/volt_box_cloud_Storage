import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./MyFiles.module.css";
import FileContext from "../../store/files/FileContext";
import FilePreviewModal from "../../components/FilePreviewModal";
import FileCard from "../../components/FileCard";
import FileFilters from "../../components/FileFilters";

export default function MyFiles() {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const { files, fileActionDispatch, loading, count } = useContext(FileContext);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeInfoId, setActiveInfoId] = useState(null);
  const [activeRenameId, setActiveRenameId] = useState(null);
  const [sortValue, setSortValue] = useState("");
  const [filterOption, setFilterOption] = useState("-- Filter By --");
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuRef.current) return;
    const { right, bottom } = menuRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (right > vw)
      (menuRef.current.style.left = "auto"),
        (menuRef.current.style.right = "0");
    if (bottom > vh)
      (menuRef.current.style.top = "auto"),
        (menuRef.current.style.bottom = "100%");
  }, [activeMenu]);

  const handleOnChange = (e) => {
    setSortValue(e.target.value);
    const val = e.target.value;
    if (val === "Clear filter") {
      setFilterOption("-- Filter By --");
      fileActionDispatch({
        type: "SORT_FILES",
        payload: { sortType: "CLEAR_FILTER" },
      });
    } else {
      setFilterOption("Clear filter");
      if (val !== "-- Filter By --") {
        fileActionDispatch({ type: "SORT_FILES", payload: { sortType: val } });
      }
    }
  };

  const handleSearchOnChange = (e) => {
    fileActionDispatch({
      type: "SEARCH_FILES",
      payload: { searchTerm: e.target.value },
    });
  };

  return (
    <div className={styles.myFilesWrapper}>
      <div className={styles.myFilesPage}>
        <FileFilters
          handleOnChange={handleOnChange}
          handleSearchOnChange={handleSearchOnChange}
          sortValue={sortValue}
          filterOption={filterOption}
          title={`My Files ${count}`}
        />
        <div className={styles.filesGrid}>
          {showPreview && (
            <FilePreviewModal
              files={files}
              onClose={() => setShowPreview(false)}
              initialIndex={previewIndex}
            />
          )}

          {loading ? (
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner}></div>
            </div>
          ) : files.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#aaa",
                fontSize: "25px",
                fontWeight: "700",
                position: "absolute",
              }}
            >
              No files available.
            </p>
          ) : (
            files.map((file, index) => (
              <FileCard
                key={file._id}
                file={file}
                index={index}
                menuRef={menuRef}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                Dispatch={fileActionDispatch}
                activeInfoId={activeInfoId}
                setActiveInfoId={setActiveInfoId}
                activeRenameId={activeRenameId}
                setActiveRenameId={setActiveRenameId}
                setShowPreview={setShowPreview}
                setPreviewIndex={setPreviewIndex}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
