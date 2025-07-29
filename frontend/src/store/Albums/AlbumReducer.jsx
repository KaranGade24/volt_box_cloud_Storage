import { parseFileSize } from "../files/FileReducer";

const AlbumsData = [
  {
    id: 1,
    name: "Travel 2025",
    cover: "https://picsum.photos/id/2/200",
    tags: ["Travel", "Nature"],
    visibility: "Public",
    files: [],
    originalFiles: [],
  },
  {
    id: 3,
    name: "Travel 2025",
    cover: "https://picsum.photos/id/5/200",
    tags: ["Travel", "Nature"],
    visibility: "Public",
    files: [],
    originalFiles: [],
  },
  {
    id: 2,
    name: "Work Reports",
    cover: "https://picsum.photos/id/125/200",
    tags: ["Work", "PDF"],
    visibility: "Private",
    files: [],
    originalFiles: [],
  },
  {
    id: 4,
    name: "Travel 2025",
    cover: "https://picsum.photos/id/175/200",
    tags: ["Travel", "Nature"],
    visibility: "Public",
    files: [],
    originalFiles: [],
  },
  {
    id: 5,
    name: "Travel 2025",
    cover: "https://picsum.photos/id/195/200",
    tags: ["Travel", "Nature"],
    visibility: "Private",
    files: [],
    originalFiles: [],
  },
  {
    id: 6,
    name: "Travel 2025",
    cover: "https://picsum.photos/id/425/200",
    tags: ["Travel", "Nature"],
    visibility: "Public",
    files: [],
    originalFiles: [],
  },
  {
    id: 7,
    name: "Travel 2025",
    cover: "https://picsum.photos/id/198/200",
    tags: ["Travel", "Nature"],
    visibility: "Public",
    files: [],
    originalFiles: [],
  },
  {
    id: 8,
    name: "Travel 2025",
    cover: "https://picsum.photos/id/178/200",
    tags: ["Travel", "Nature"],
    visibility: "Public",
    files: [],
    originalFiles: [],
  },
];
export const INITIAL_STATE = {
  Albums: AlbumsData,
  originalFiles: [],
};

function AlbumReducer(state, action) {
  switch (action.type) {
    case "CREATE_ALBUM":
      console.log(action.payload);
      return {
        ...state,
        Albums: [action.payload, ...state.Albums],
      };
    // 🔁 Rename a file inside a specific album
    case "RENAME_FILE": {
      const { fileId, newName, AlbumId } = action.payload;
      return {
        ...state,
        Albums: state.Albums.map((album) =>
          album.id === +AlbumId
            ? {
                ...album,
                files: album.files.map((file) =>
                  file.id === fileId ? { ...file, name: newName } : file
                ),
              }
            : album
        ),
      };
    }
    // ❌ Delete a file from all albums
    case "DELETE_FILE": {
      const { fileId, AlbumId } = action.payload;
      return {
        ...state,
        Albums: state.Albums.map((album) =>
          album.id === +AlbumId
            ? {
                ...album,
                files: album.files.filter((file) => file.id !== fileId),
              }
            : album
        ),
      };
    }
    // 🔍 Search by file name (case-insensitive)
    case "SEARCH_FILES": {
      const { searchTerm, AlbumId } = action.payload;
      if (searchTerm === "") {
        return {
          ...state,
          Albums: state.Albums.map((album) =>
            album.id === +AlbumId
              ? {
                  ...album,
                  files: [...album.originalFiles],
                }
              : album
          ),
        };
      }
      return {
        ...state,
        Albums: state.Albums.map((album) =>
          album.id === +AlbumId
            ? {
                ...album,
                files: album.originalFiles.filter((file) =>
                  file.name.toLowerCase().includes(searchTerm.toLowerCase())
                ),
              }
            : album
        ),
      };
    }
    // 🔃 Sort files inside all albums
    case "SORT_FILES": {
      const { sortType, AlbumId } = action.payload;

      const sortFiles = (files) => {
        switch (sortType) {
          case "newest":
          case "date":
            return [...files].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
          case "oldest":
            return [...files].sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
          case "name":
            return [...files].sort((a, b) => a.name.localeCompare(b.name));
          case "size":
            return [...files].sort(
              (a, b) => parseFileSize(b.size) - parseFileSize(a.size)
            );
          case "CLEAR_FILTER": {
            const { AlbumId } = action.payload;
            return {
              ...state,
              Albums: state.Albums.map((album) =>
                album.id === +AlbumId
                  ? {
                      ...album,
                      files: [...album.originalFiles],
                    }
                  : album
              ),
            };
          }

          default:
            return files;
        }
      };

      return {
        ...state,
        Albums: state.Albums.map((album) =>
          album.id === +AlbumId
            ? {
                ...album,
                files: sortFiles(album.files),
              }
            : album
        ),
      };
    }
    // // 🧪 Optional: Filter albums by visibility (e.g. Public / Private)
    // case "FILTER_BY_VISIBILITY": {
    //   const { visibility } = action.payload;
    //   return {
    //     ...state,
    //     Albums: state.Albums.filter((album) => album.visibility === visibility),
    //   };
    // }

    default:
      return state;
  }
}

export default AlbumReducer;
