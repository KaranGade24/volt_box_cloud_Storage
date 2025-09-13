import React from "react";
import styles from "./Sidebar.module.css";
import { MdDashboard } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { VscFiles } from "react-icons/vsc";
import { BsCollection } from "react-icons/bs";
import { FaUser, FaUserCircle } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import VotBoxLogo, { VoltboxSymbol } from "./VotBoxLogo";
import { NavLink } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

function Sidebar({ showCreateModal }) {
  return (
    <div
      className={styles["sidebar-container"]}
      style={{
        zIndex: showCreateModal ? "0" : "1000",
        // position: "relative", // required for zIndex to apply
      }}
    >
      <Tooltip
        id="tooltip"
        place="right"
        effect="solid"
        clickable={true}
        delayHide={300}
        className={styles.sidebarTooltip}
      />

      <div className={styles["sidebar-body"]}>
        {/* Logo */}
        <p
          style={{
            cursor: "auto",
            background: "none",
            boxShadow: "none",
            borderBottom: "1px solid #1862cb",
            width: "100%",
            borderRadius: "0",
            pointerEvents: "none",
            margin: "0px",
          }}
          className={styles.logo}
        >
          <VoltboxSymbol />
          <span style={{ color: "white", fontSize: "30px", height: "30px" }}>
            <VotBoxLogo />
          </span>
        </p>

        {/* Navigation */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <p data-tooltip-id="tooltip" data-tooltip-content="Dashboard">
            <MdDashboard className={styles["sidebar-icon"]} />
            <span className={styles.label}>Dashboard</span>
          </p>
        </NavLink>

        <NavLink
          to="/upload"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <p data-tooltip-id="tooltip" data-tooltip-content="Upload">
            <FiUpload className={styles["sidebar-icon"]} />
            <span>Upload</span>
          </p>
        </NavLink>

        <NavLink
          to="/myfiles"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <p data-tooltip-id="tooltip" data-tooltip-content="My Files">
            <VscFiles className={styles["sidebar-icon"]} />
            <span>My Files</span>
          </p>
        </NavLink>

        <NavLink
          to="/albums"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <p data-tooltip-id="tooltip" data-tooltip-content="Albums">
            <BsCollection className={styles["sidebar-icon"]} />
            <span>Albums</span>
          </p>
        </NavLink>

        {/* <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <p data-tooltip-id="tooltip" data-tooltip-content="Profile">
            <FaUserCircle className={styles["sidebar-icon"]} />
            <span>Profile</span>
          </p>
        </NavLink> */}

        <NavLink
          // to="/settings"
          to="/profile"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <p data-tooltip-id="tooltip" data-tooltip-content="Settings">
            {/* <IoSettingsSharp className={styles["sidebar-icon"]} /> */}
            <FaUser className={styles["sidebar-icon"]} />
            <span>Settings</span>
          </p>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
