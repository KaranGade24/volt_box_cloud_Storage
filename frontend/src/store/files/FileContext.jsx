import { createContext } from "react";

const FileContext = createContext({
  fileActionDispatch: () => {},
  files: [],
  loading: true,
  count: 0,
  fetchFiles: (page, limit, signal, setLoading, albumId) => {},
  albumHasMore: true,
  hasMore: true,
  uploadFiles: null,
  setUploadFiles: () => {},
});

export default FileContext;
