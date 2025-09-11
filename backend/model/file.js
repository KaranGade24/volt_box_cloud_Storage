import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true, // Example: 'image', 'pdf', 'video', 'other'
    },
    size: {
      type: String, // Example: '2.3 MB'
      required: true,
    },
    extension: {
      type: String,
      required: true, // Example: '.png', '.pdf'
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album", // for album-based categorization
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const File = mongoose.model("File", fileSchema);

export default File;
