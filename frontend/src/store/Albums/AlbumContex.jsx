import { createContext } from "react";

const AlbumContext = createContext({
  AlbumDispatch: () => {},
  Albums: [],
  loading: null,
  fetchAlbums: (page, limit, signal, setLoading) => {},
  hasMore: true,
  dashboardData: null,
  setDashboardData: () => {},
  getDashboardData: () => {},
  user: null,
  setUser: () => {},
});

export default AlbumContext;
