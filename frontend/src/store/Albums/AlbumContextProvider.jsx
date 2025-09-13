import React, { useEffect, useReducer, useRef, useState } from "react";
import AlbumContext from "./AlbumContex";
import AlbumReducer, { INITIAL_STATE } from "./AlbumReducer";

function AlbumContextProvider({ children }) {
  const [state, AlbumDispatch] = useReducer(AlbumReducer, INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const hasMore = useRef(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);

  const fetchAlbums = async (
    page = 1,
    limit = 5,
    signal,
    setLoadingPara = setLoading
  ) => {
    try {
      let data = {};
      if (!hasMore.current && page > 1) return (data = { hasMore: false });

      setLoadingPara(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/album?${new URLSearchParams({
          page,
          limit,
        })}`,
        {
          method: "GET",
          credentials: "include",
          signal,
        }
      );

      data = await res.json();

      if (!res.ok) {
        AlbumDispatch({
          type: "INITIALIZE_ALBUMS",
          payload: { Albums: [], count: 0 },
        });
        return;
      }

      const albums = data.albums.map((album) => {
        return {
          ...album,
          originalFiles: album.files,
        };
      });

      if (page === 1) {
        // dispatch the initial albums
        AlbumDispatch({
          type: "INITIALIZE_ALBUMS",
          payload: {
            Albums: albums,
            count: data?.totalAlbums || 0,
          },
        });
      } else {
        // add albums (for infinite scroll or load more)
        AlbumDispatch({
          type: "ADD_ALBUMS",
          payload: albums,
        });
      } // so caller can use pagination info
      data = {
        ...data,
        page: data.page + 1,
        hasMore: data.page + 1 <= data.totalPages ? true : false,
      };
      hasMore.current = data.hasMore;

      return data;
    } catch (error) {
      console.error("fetchAlbums error:", error);
    } finally {
      setLoadingPara(false);
    }
  };

  useEffect(() => {
    if (user === null) return;

    const controller = new AbortController();
    const signal = controller.signal;
    fetchAlbums(1, 5, signal);

    return () => {
      controller.abort();
    };
  }, [user]);

  const getDashboardData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
        credentials: "include", // cookies/session
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch dashboard data");
      }

      setDashboardData(data);
      return data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    getDashboardData();
  }, [user]);

  return (
    <AlbumContext.Provider
      value={{
        AlbumDispatch,
        Albums: state.Albums,
        loading,
        fetchAlbums,
        hasMore,
        dashboardData,
        setDashboardData,
        getDashboardData,
        user,
        setUser,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
}

export default AlbumContextProvider;
