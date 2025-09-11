import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styles from "./App.module.css";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlbumContext from "./store/Albums/AlbumContex";

function App() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { Albums, AlbumDispatch } = useContext(AlbumContext);
  const [user, setUser] = useState(null);

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
