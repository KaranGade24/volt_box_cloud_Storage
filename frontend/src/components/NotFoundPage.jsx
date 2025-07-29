import React from "react";
import { Frown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.logo}>
          <svg
            width="150"
            height="50"
            viewBox="0 0 150 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="0"
              y="40"
              fontFamily="Inter, sans-serif"
              fontSize="40"
              fontWeight="bold"
            >
              <tspan fill="#6366F1">Volt</tspan>
              <tspan fill="#E0E0E0">Box</tspan>
            </text>
          </svg>
        </div>

        <Frown className={styles.icon} />
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          Oops! The page you're looking for doesn't exist or has been moved.
          Please check the URL or go back to the homepage.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className={styles.button}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
