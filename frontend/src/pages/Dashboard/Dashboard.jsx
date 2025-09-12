import React, { useContext, useEffect, useState } from "react";
import StorageOverview from "../../components/StorageOverview";
import RecentUploads from "../../components/RecentUploads";
import styles from "./Dashboard.module.css";
import "../../index.css";
import FileStats from "../../components/FileStats";
import AlbumContext from "../../store/Albums/AlbumContex";

export default function Dashboard() {
  const { dashboardData } = useContext(AlbumContext);

  console.log(dashboardData);

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Dashboard</h1>

          <div className={styles.storageContainer}>
            <div className={styles.topSection}>
              <StorageOverview
                used={dashboardData?.storage?.used || 0}
                total={dashboardData?.storage?.total || 0}
                percentage={dashboardData?.storage?.percent || 0}
              />
              <RecentUploads dashboardData={dashboardData} />
            </div>

            <div className={styles.statsSection}>
              <FileStats dashboardData={dashboardData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
