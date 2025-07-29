import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AlbumContext from "../../store/Albums/AlbumContex";
import styles from "../MyFiles/MyFiles.module.css";
import FileCard from "../../components/FileCard";
import FileFilters from "../../components/FileFilters";
import FilePreviewModal from "../../components/FilePreviewModal";

function AlbumPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  console.log({ albumId });
  const { Albums, AlbumDispatch } = useContext(AlbumContext);
  console.log({ Albums });
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeInfoId, setActiveInfoId] = useState(null);
  const [activeRenameId, setActiveRenameId] = useState(null);
  const [sortValue, setSortValue] = useState("");
  const [filterOption, setFilterOption] = useState("-- Filter By --");
  const menuRef = useRef(null);

  const album = Albums.find((album) => String(album.id) === String(albumId));
  console.log({ album });
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
                key={file.id}
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
        </div>
      </div>
    </div>
  );
}

export default AlbumPage;
