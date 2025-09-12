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
import FileContext from "./store/files/FileContext";

function App() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user, setUser } = useContext(AlbumContext);
  const { fetchFiles } = useContext(FileContext);

  useEffect(() => {
    if (user === null) return;

    const controller = new AbortController();
    const signal = controller.signal;
    console.log("fetchin file:");
    fetchFiles(1, 5, signal);

    return () => {
      controller.abort();
    };
  }, [user]);

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

      {user === null && (
        <div className={styles.loadingScreen}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      )}

      {user !== null && (
        <>
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
      )}
    </>
  );
}

export default App;
