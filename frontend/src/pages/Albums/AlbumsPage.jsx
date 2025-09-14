import React, { useContext, useState } from "react";
import styles from "./AlbumPage.module.css";
import Sidebar from "../../components/Sidebar";
import CreateAlbumModal from "../../components/CreateAlbumModal";
import { useNavigate, useOutletContext } from "react-router-dom";
import AlbumContext from "../../store/Albums/AlbumContex";
import { FaSpinner } from "react-icons/fa";
import { BsSignal } from "react-icons/bs";

export default function AlbumsPage() {
  const navigate = useNavigate();
  const {
    Albums,
    loading,
    fetchAlbums,
    hasMore: albumHasMore,
  } = useContext(AlbumContext);
  const { showCreateModal, setShowCreateModal } = useOutletContext();
  const [loagindMore, setLoagindMore] = useState(false);
  const [page, setPage] = useState(2);

  const handleFetchAlbums = async () => {
    const contorller = new AbortController();
    const Signal = contorller.signal;
    try {
      setLoagindMore(true);
      const data = await fetchAlbums(page, 5, Signal, setLoagindMore);

      if (albumHasMore) {
        setPage(data?.page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoagindMore(false);
      contorller.abort();
    }
  };
  return (
    <div className={styles.page}>
      {/* <Sidebar showCreateModal={showCreateModal} /> */}
      <div className={styles.content}>
        <div className={styles.header}>
          <p className={styles.title}>My Albums </p>
          <button
            className={styles.createBtn}
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Album
          </button>
        </div>

        {Albums.length > 0 && (
          <div className={styles.albumGrid}>
            {Albums.map((album, index) => (
              <div
                onClick={() => {
                  navigate(`/album/${album._id}`);
                }}
                key={album._id + index}
                className={styles.albumCard}
              >
                <img
                  src={album.coverImage?.url}
                  alt={album.name}
                  className={styles.albumCover}
                />
                <h3>{album.name}</h3>
                <div className={styles.tagGroup}>
                  {album.tags.map((tag, i) => (
                    <span key={i} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <span
                  className={
                    album?.accessControl === "Public"
                      ? styles.public
                      : styles.private
                  }
                >
                  {album?.accessControl}
                </span>
              </div>
            ))}
            <br />
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
              {albumHasMore.current && (
                <button
                  style={{
                    padding: "10px 20px",
                  }}
                  disabled={!albumHasMore.current}
                  onClick={handleFetchAlbums}
                >
                  {loading || loagindMore ? (
                    <>
                      Loading albums... <FaSpinner speed={1} />{" "}
                    </>
                  ) : albumHasMore.current ? (
                    "Load More"
                  ) : null}
                  {!albumHasMore.current && null}
                </button>
              )}
            </div>
          </div>
        )}

        {Albums.length === 0 && (
          <div className={styles.noAlbums}> No albums available</div>
        )}

        {showCreateModal && (
          <div className={styles.modalWrapper}>
            <CreateAlbumModal onClose={() => setShowCreateModal(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
