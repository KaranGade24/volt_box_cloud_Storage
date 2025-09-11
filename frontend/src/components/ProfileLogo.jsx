import React from "react";
import styles from "./ProfileLogo.module.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function ProfileLogo() {
  const navigate = useNavigate();
  return (
    <p style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
      <FaUserCircle className={styles["sidebar-icon"]} />
      <span style={{ color: "white" }}>Profile</span>
    </p>
  );
}

export default ProfileLogo;
