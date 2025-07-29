import React from "react";
import styles from "./ProfileLogo.module.css";
import { FaUserCircle } from "react-icons/fa";
function ProfileLogo() {
  return (
    <p>
      <FaUserCircle className={styles["sidebar-icon"]} />
      <span style={{ color: "white" }}>Profile</span>
    </p>
  );
}

export default ProfileLogo;
