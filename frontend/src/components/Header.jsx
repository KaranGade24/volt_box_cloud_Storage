import React from "react";
import styles from "./Header.module.css";
import ProfileLogo from "./ProfileLogo";

function Header() {
  return (
    <>
      <div style={{ display: "flex", borderBottom: "1px solid #161b22" }}>
        <div className={styles["header"]}>
          <h1>
            <span className={styles.volt}>Volt</span>
            <span className={styles.box}>Box</span>
          </h1>
        </div>

        <div className={styles["profile-container"]}>
          <ProfileLogo />
        </div>
      </div>
    </>
  );
}

export default Header;
