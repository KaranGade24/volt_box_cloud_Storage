// src/components/Settings.jsx
import React from "react";
import styles from "./Settings.module.css";

export default function Settings() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.grid}>
        {/* Account Settings */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Account Settings</h2>
          <div className={styles.accountInfo}>
            <div className={styles.avatar}>👤</div>
            <div style={{ wordBreak: "break-all" }}>
              <p className={styles.name}>John Doe</p>
              <p className={styles.email}>john.doe@example.com</p>
            </div>
          </div>
          <div className={styles.actions}>
            <button className={styles.btn}>Change Password</button>
            <button className={styles.btnPrimary}>Edit Profile Info</button>
          </div>
        </section>

        {/* Storage Settings */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Storage Settings</h2>
          <div className={styles.storagePlan}>
            <div>
              <p className={styles.planLabel}>Free Plan</p>
            </div>
            <button className={styles.btnPrimarySm}>Upgrade Plan</button>
          </div>
          <div className={styles.storageBar}>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: "74%" }} />
            </div>
            <p className={styles.usageText}>7.4 GB of 10 GB used</p>
          </div>
          <label className={styles.switchLabel}>
            <input type="checkbox" defaultChecked />
            <span className={styles.switch}></span>
            Auto compress images before upload
          </label>
        </section>

        {/* Preferences */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Preferences</h2>
          <div className={styles.prefRow}>
            <span>Language</span>
            <button className={styles.btnText}>English ›</button>
          </div>
          <div className={styles.prefRow}>
            <span>Dark Mode</span>
            <label className={styles.switchLabel}>
              <input type="checkbox" defaultChecked />
              <span className={styles.switch}></span>
            </label>
          </div>
          <div className={styles.prefRow}>
            <span>Default File View</span>
            <div className={styles.btnGroup}>
              <button className={styles.btnToggleActive}>Grid</button>
              <button className={styles.btnToggle}>List</button>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Notification Settings</h2>
          {[
            "Email Notifications",
            "Upload Confirmations",
            "New Feature Alerts",
          ].map((label) => (
            <label key={label} className={styles.switchLabel}>
              <input type="checkbox" defaultChecked />
              <span className={styles.switch}></span>
              {label}
            </label>
          ))}
        </section>

        {/* Danger Zone */}
        <section className={styles.cardDanger}>
          <h2 className={styles.cardTitle}>Danger Zone</h2>
          <button className={styles.btnDanger}>Delete My Account</button>
        </section>
      </div>
    </div>
  );
}
