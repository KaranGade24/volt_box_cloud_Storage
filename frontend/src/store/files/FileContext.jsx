import { createContext } from "react";

const FileContext = createContext({
  fileActionDispatch: () => {},
  files: [],
  loading: true,
  count: 0,
});

export default FileContext;
