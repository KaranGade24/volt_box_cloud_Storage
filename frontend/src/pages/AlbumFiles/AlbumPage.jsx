import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AlbumContext from "../../store/Albums/AlbumContex";
import styles from "../MyFiles/MyFiles.module.css";
import FileCard from "../../components/FileCard";
import FileFilters from "../../components/FileFilters";
import FilePreviewModal from "../../components/FilePreviewModal";
import { FaSpinner } from "react-icons/fa";
import FileContext from "../../store/files/FileContext";

function AlbumPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { Albums, AlbumDispatch, loading } = useContext(AlbumContext);
  const { fetchFiles, albumHasMore } = useContext(FileContext);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeInfoId, setActiveInfoId] = useState(null);
  const [activeRenameId, setActiveRenameId] = useState(null);
  const [sortValue, setSortValue] = useState("");
  const [filterOption, setFilterOption] = useState("-- Filter By --");
  const menuRef = useRef(null);
  const [loagindMore, setLoagindMore] = useState(false);
  const [page, setPage] = useState(2);

  const album = Albums.find((album) => String(album._id) === String(albumId));
  useEffect(() => {
    // redirect if album not found
    if (!album) {
      navigate("/albums/not-found", { replace: true });
    }
  }, [album, navigate]);

  useEffect(() => {
    if (!menuRef.current) return;
    const { right, bottom } = menuRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (right > vw) {
      menuRef.current.style.left = "auto";
      menuRef.current.style.right = "0";
    }
    if (bottom > vh) {
      menuRef.current.style.top = "auto";
      menuRef.current.style.bottom = "100%";
    }
  }, [activeMenu]);

  const handleOnChange = (e) => {
    const val = e.target.value;
    setSortValue(val);

    if (val === "Clear filter") {
      setFilterOption("-- Filter By --");
      AlbumDispatch({
        type: "SORT_FILES",
        payload: { sortType: "CLEAR_FILTER", AlbumId: albumId },
      });
    } else {
      setFilterOption("Clear filter");
      if (val !== "-- Filter By --") {
        AlbumDispatch({
          type: "SORT_FILES",
          payload: { sortType: val, AlbumId: albumId },
        });
      }
    }
  };

  const handleSearchOnChange = (e) => {
    const searchTerm = e.target.value;
    AlbumDispatch({
      type: "SEARCH_FILES",
      payload: { searchTerm, AlbumId: albumId },
    });
  };

  const handleFetchAlbums = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoagindMore(true);
      const data = await fetchFiles(page, 10, signal, setLoagindMore, albumId);
      AlbumDispatch({
        type: "ADD_FILES_TO_ALBUM",
        payload: { files: data.files, AlbumId: albumId },
      });
      if (albumHasMore.current) {
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      controller.abort();
      setLoagindMore(false);
    }
  };

  if (!album) return null;

  const files = album.files || [];

  return (
    <div className={styles.myFilesWrapper}>
      <div className={styles.myFilesPage}>
        <div className={styles.topBar}></div>
        <div className={styles.backBar}>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/albums")}
          >
            ← Back to Albums
          </button>
        </div>

        <FileFilters
          handleOnChange={handleOnChange}
          handleSearchOnChange={handleSearchOnChange}
          sortValue={sortValue}
          filterOption={filterOption}
          title={album.name}
          fromAlbumPage={1}
        />

        <div className={styles.filesGrid}>
          {showPreview && (
            <FilePreviewModal
              files={files}
              onClose={() => setShowPreview(false)}
              initialIndex={previewIndex}
            />
          )}

          {files.length > 0 ? (
            files.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                index={index}
                menuRef={menuRef}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                Dispatch={AlbumDispatch}
                activeInfoId={activeInfoId}
                setActiveInfoId={setActiveInfoId}
                activeRenameId={activeRenameId}
                setActiveRenameId={setActiveRenameId}
                setShowPreview={setShowPreview}
                setPreviewIndex={setPreviewIndex}
                AlbumId={albumId}
              />
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#aaa" }}>
              No files in this album.
            </div>
          )}

          <button disabled={!albumHasMore.current} onClick={handleFetchAlbums}>
            {loading || loagindMore ? (
              <>
                Loading files... <FaSpinner speed={1} />{" "}
              </>
            ) : albumHasMore.current ? (
              "Load More"
            ) : null}
            {!albumHasMore.current && (
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
      </div>
    </div>
  );
}

export default AlbumPage;
