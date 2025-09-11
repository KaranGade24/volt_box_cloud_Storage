import React from "react";
import styles from "../pages/MyFiles/MyFiles.module.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function FileFilters({
  handleOnChange,
  handleSearchOnChange,
  sortValue,
  filterOption,
  title,
  fromAlbumPage = null,
}) {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.title}>{title}</div>
        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <FaSearch />
            <input
              type="text"
              onChange={handleSearchOnChange}
              placeholder="Search files..."
            />
          </div>
          {fromAlbumPage === null && (
            <button
              onClick={() => navigate("/upload")}
              className={styles.uploadBtn}
            >
              Upload New File
            </button>
          )}
        </div>
      </div>
      <div className={styles.filters}>
        <select
          className={styles.select}
          value={sortValue}
          onChange={handleOnChange}
        >
          <option value={filterOption}>{filterOption}</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="size">Size</option>
          <option value="name">Name</option>
          <option value="date">Date</option>
        </select>
      </div>
    </>
  );
}

export default FileFilters;
