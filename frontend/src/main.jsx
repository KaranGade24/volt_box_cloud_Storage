import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router";
import FileContextProvider from "./store/files/FileContextProvider";
import AlbumContextProvider from "./store/Albums/AlbumContextProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FileContextProvider>
      <AlbumContextProvider>
        <RouterProvider router={Router} />
      </AlbumContextProvider>
    </FileContextProvider>
  </StrictMode>
);
