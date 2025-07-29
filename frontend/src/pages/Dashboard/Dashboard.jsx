import React from "react";
import StorageOverview from "../../components/StorageOverview";
import RecentUploads from "../../components/RecentUploads";
import styles from "./Dashboard.module.css";
import "../../index.css";
import FileStats from "../../components/FileStats";

export default function Dashboard() {
  return (
    <div className={styles.wrapper}>

      <div className={styles.main}>

        <div className={styles.content}>
          
          <h1 className={styles.title}>Dashboard</h1>

          <div className={styles.storageContainer}>
            <div className={styles.topSection}>
              <StorageOverview used={6.5} total={10} />
              <RecentUploads />
            </div>

            <div className={styles.statsSection}>
              <FileStats />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
