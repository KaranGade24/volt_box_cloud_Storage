import React, { useEffect, useReducer, useRef, useState } from "react";
import FileReducer, { INITIAL_STATE } from "./FileReducer";
import FileContext from "./FileContext";

function FileContextProvider({ children }) {
  const [state, fileActionDispatch] = useReducer(FileReducer, INITIAL_STATE);
  const [loading, setLoading1] = useState(true);
  const hasMore = useRef(true);
  const albumHasMore = useRef(true);
  const [albumPage, setAlbumPage] = useState(1);
  const [filePage, setFilePage] = useState(1);

  const fetchFiles = async (
    page = 1,
    limit = 5,
    signal,
    setLoading = setLoading1,
    albumId = null
  ) => {
    try {
      let data = {};

      if (!hasMore.current && albumId === null)
        return (data = { hasMore: false });
      if (!albumHasMore.current && albumId !== null)
        return (data = { hasMore: false });

      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/file?${new URLSearchParams({
          page: albumId !== null ? albumPage : filePage,
          limit,
          albumId,
        })}`,
        {
          method: "GET",
          credentials: "include",
          signal,
        }
      );
      data = await res.json();
      console.log("data:", data);

      if (!res.ok) {
        fileActionDispatch({
          type: "INITIATE_FILE",
          payload: { files: [], count: 0 },
        });
        return;
      }

      if (albumId === null) {
        if (page === 1) {
          console.log("setting files", {
            limit: data.limit,
            totalFiles: data.totalFiles,
            files: data.files,
          });

          //dispatch the initial files
          fileActionDispatch({
            type: "INITIATE_FILE",
            payload: {
              files: data?.files,
              count: data?.totalFiles || "undefined",
            },
          });
        }

        fileActionDispatch({
          type: "ADD_FILE",
          payload: data.files,
        });
      }

      data = {
        ...data,
        page: data.page + 1,
        hasMore: data.page + 1 < data.totalPages ? true : false,
      };
      if (albumId === null) {
        hasMore.current = data.hasMore;
        if (data.hasMore) {
          setFilePage(data.page);
        }
      }
      if (albumId !== null) {
        albumHasMore.current = data.hasMore;
        if (data.hasMore) {
          setAlbumPage(data.page);
        }
      }

      console.log("file from file context: ", { data });

      return data;
      // data for other files
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchFiles(1, 5, signal);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <FileContext.Provider
      value={{
        fileActionDispatch,
        files: state.files,
        loading,
        count: state.count,
        fetchFiles: fetchFiles,
        albumHasMore,
        hasMore,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export default FileContextProvider;
