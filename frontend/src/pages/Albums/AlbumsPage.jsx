import React, { useContext, useState } from "react";
import styles from "./AlbumPage.module.css";
import Sidebar from "../../components/Sidebar";
import CreateAlbumModal from "../../components/CreateAlbumModal";
import { useNavigate, useOutletContext } from "react-router-dom";
import AlbumContext from "../../store/Albums/AlbumContex";

export default function AlbumsPage() {
  const navigate = useNavigate();
  const { Albums, AlbumDispatch } = useContext(AlbumContext);
  const { showCreateModal, setShowCreateModal } = useOutletContext();

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

        <div className={styles.albumGrid}>
          {Albums.map((album, index) => (
            <div
              onClick={() => {
                navigate(`/album/${album.id}`);
              }}
              key={album.id}
              className={styles.albumCard}
            >
              <img
                src={album.cover}
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
                  album.visibility === "Public" ? styles.public : styles.private
                }
              >
                {album.visibility}
              </span>
            </div>
          ))}
        </div>

        {showCreateModal && (
          <div className={styles.modalWrapper}>
            <CreateAlbumModal onClose={() => setShowCreateModal(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
