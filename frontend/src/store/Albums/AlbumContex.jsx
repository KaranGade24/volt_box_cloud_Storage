import { createContext } from "react";

const AlbumContext = createContext({
  AlbumDispatch: () => {},
  Albums: [],
  loading: null,
  fetchAlbums: (page, limit, signal, setLoading) => {},
  hasMore: true,
  loadDashBoardStatus:null,
  setLoadDashBoardStatus:()=>{},
});

export default AlbumContext;
