// src/components/UserProfile.jsx
import React, { useEffect, useState } from "react";
import styles from "./UserProfile.module.css";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      const u = localStorage.getItem("user");
      if (u) {
        setUser(JSON.parse(u));
      } else {
        setUser(null);
        navigate("/login");
      }
    };

    // run once on mount
    checkUser();

    // listen for storage changes
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // ✅ send cookies if JWT/session
      });

      if (res.ok) {
        localStorage.removeItem("user"); // clear local storage
        window.location.href = "/login"; // redirect to login
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Profile</h1>
      <div className={styles.card}>
        <div className={styles.accountInfo}>
          <div className={styles.avatar}>
            <FaUser size={32} />
            {/* <MdAccountCircle size={40} /> */}
            {/* <HiUser size={36} /> */}
          </div>
          <div className={styles.info}>
            <p className={styles.name}>Name: {user?.user?.name}</p>
            <p className={styles.email}>Email: {user?.user?.email}</p>
          </div>
        </div>
        <button className={styles.btnDanger} onClick={handleLogout}>
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
