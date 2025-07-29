import { createContext } from "react";

const AlbumContext = createContext({
  AlbumDispatch: () => {},
  Albums: [],
});

export default AlbumContext;
