import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    coverImage: {
      type: Object,
      default: null, // URL or file reference
    },
    // isFavorite: {
    //   type: Boolean,
    //   default: false,
    // },
    tags: {
      type: [String],
      default: [],
    },

    accessControl: {
      type: String,
      enum: ["private", "public", "shared"],
      default: "private",
    },

    sharedWith: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
          enum: ["view", "edit"],
          default: "view",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Album = mongoose.model("Album", albumSchema);

export default Album;
