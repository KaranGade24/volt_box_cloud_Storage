import React, { useReducer } from "react";
import AlbumContext from "./AlbumContex";
import AlbumReducer, { INITIAL_STATE } from "./AlbumReducer";

function AlbumContextProvider({ children }) {
  const [state, AlbumDispatch] = useReducer(AlbumReducer, INITIAL_STATE);

  return (
    <AlbumContext.Provider value={{ AlbumDispatch, Albums: state.Albums }}>
      {children}
    </AlbumContext.Provider>
  );
}

export default AlbumContextProvider;
