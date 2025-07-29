import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styles from "./App.module.css";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // useEffect(() => {
  //   const protect = async () => {
  //     try {
  //       const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
  //         method: "POST",
  //         credentials: "include",
  //       });

  //       if (!res.ok) {
  //         navigate("/login");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //       navigate("/login");
  //     }
  //   };
  //   protect();
  // }, [navigate]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Sidebar showCreateModal={showCreateModal} />
          <div className={styles.main}>
            <Header />
            <Outlet context={{ showCreateModal, setShowCreateModal }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
