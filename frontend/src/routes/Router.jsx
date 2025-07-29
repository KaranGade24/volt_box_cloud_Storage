import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import App from "../App";
import MyFiles from "../pages/MyFiles/MyFiles";
import AlbumsPage from "../pages/Albums/AlbumsPage";
import Upload from "../pages/UploadPage/Upload";
import Settings from "../pages/SettingsPage/Settings";
import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";
import AlbumPage from "../pages/AlbumFiles/AlbumPage";
import NotFoundPage from "../components/NotFoundPage";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/myfiles", element: <MyFiles /> },
      { path: "/albums", element: <AlbumsPage /> },
      { path: "/album/:albumId", element: <AlbumPage /> },
      { path: "/upload", element: <Upload /> },
      { path: "/settings", element: <Settings /> },
      { path: "/not-found", element: <NotFoundPage /> },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFoundPage /> },
]);

export default Router;
