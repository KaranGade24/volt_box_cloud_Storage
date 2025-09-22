import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router";
import FileContextProvider from "./store/files/FileContextProvider";
import AlbumContextProvider from "./store/Albums/AlbumContextProvider";

const rootEl = document.getElementById("root");
const preloaderEl = document.getElementById("preloader");

const root = createRoot(rootEl);

root.render(
  <StrictMode>
    <FileContextProvider>
      <AlbumContextProvider>
        <RouterProvider router={Router} />
      </AlbumContextProvider>
    </FileContextProvider>
  </StrictMode>
);

// ✅ After React mounts, hide preloader
setTimeout(() => {
  if (preloaderEl) preloaderEl.classList.add("hide");
  rootEl.style.display = "block";

  // optional: remove preloader after fade-out
  setTimeout(() => preloaderEl?.remove(), 500);
}, 300);
