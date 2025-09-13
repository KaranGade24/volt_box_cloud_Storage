import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styles from "./App.module.css";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlbumContext from "./store/Albums/AlbumContex";
import FileContext from "./store/files/FileContext";

function App() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user, setUser, Albums, fetchAlbums } = useContext(AlbumContext);
  const { fetchFiles } = useContext(FileContext);
  const { albumId } = useParams();
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Albums
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      if (!user) return;
      if (Albums.length === 0) {
        setLoading(true);
        await fetchAlbums(1, 5, signal, setLoading);
        setLoading(false);
      }
      if (!albumId) return; // ✅ better check
    };

    fetchData();

    return () => controller.abort();
  }, [albumId]);

  // 🔹 Fetch Files
  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    const signal = controller.signal;

    fetchFiles(1, 5, signal);

    return () => controller.abort();
  }, [user]);

  // 🔹 Check user login
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

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [navigate, setUser]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {(!!albumId && Albums.length === 0) || user === null ? (
        <div className={styles.loadingScreen}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      ) : (
        user !== null && (
          <div className={styles.container}>
            <div className={styles.wrapper}>
              <Sidebar showCreateModal={showCreateModal} />
              <div className={styles.main}>
                <Header />
                <Outlet context={{ showCreateModal, setShowCreateModal }} />
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}

export default App;
