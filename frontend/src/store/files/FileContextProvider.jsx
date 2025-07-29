import React, { useEffect, useReducer, useState } from "react";
import FileReducer, { INITIAL_STATE } from "./FileReducer";
import FileContext from "./FileContext";

function FileContextProvider({ children }) {
  const [state, fileActionDispatch] = useReducer(FileReducer, INITIAL_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const AbortController = new AbortController();
    const signal = AbortController.signal;
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/file`, {
          method: "GET",
          credentials: "include",
          signal,
        });
        const data = await res.json();
        console.log("data:", data);
        if (!res.ok) {
          fileActionDispatch({
            type: "INITIATE_FILE",
            payload: { files: [], count: 0 },
          });
          return;
        }
        fileActionDispatch({ type: "INITIATE_FILE", payload: data });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
    return () => {
      AbortController.abort();
    };
  }, []);

  return (
    <FileContext.Provider
      value={{
        fileActionDispatch,
        files: state.files,
        loading,
        count: state.count,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export default FileContextProvider;
