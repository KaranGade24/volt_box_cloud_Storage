import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./MyFiles.module.css";
import FileContext from "../../store/files/FileContext";
import FilePreviewModal from "../../components/FilePreviewModal";
import FileCard from "../../components/FileCard";
import FileFilters from "../../components/FileFilters";
import { FaSpinner } from "react-icons/fa";

export default function MyFiles() {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const { files, fileActionDispatch, loading, count, fetchFiles, hasMore } =
    useContext(FileContext);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeInfoId, setActiveInfoId] = useState(null);
  const [activeRenameId, setActiveRenameId] = useState(null);
  const [sortValue, setSortValue] = useState("");
  const [filterOption, setFilterOption] = useState("-- Filter By --");
  const menuRef = useRef(null);
  const loaderRef = useRef(null);
  // const [hasMore, setHasMore] = useState(true);
  const [currectPage, setCurrentPage] = useState(2);
  const [loagindMore, setLoagindMore] = useState(false);

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
      // setHasMore(currectPage < data.totalPages ? true : false);
      if (hasMore.current) {
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
        {files.length > 0 && (
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
                  key={file._id + index + file.name}
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
            {/* loader div → watched by IntersectionObserver */}
            {hasMore.current && (
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
                  disabled={!hasMore.current}
                  onClick={handleFetchFile}
                >
                  {loading || loagindMore ? (
                    <>
                      Loading files... <FaSpinner speed={1} />{" "}
                    </>
                  ) : hasMore.current ? (
                    "Load More"
                  ) : null}
                  {!hasMore.current && (
                    <h4
                      style={{
                        color: "#aaa",
                        wordBreak: "break-all",
                        fontSize: "20px",
                        textAlign: "center",
                        fontWeight: "700",
                      }}
                    ></h4>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {count === 0 && (
          <div className={styles.noFiles}> No files available</div>
        )}
      </div>
    </div>
  );
}
