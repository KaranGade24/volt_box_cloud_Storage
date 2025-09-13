import cloudinary from "./cloudinary.js";

function getResourceType(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/") || mimetype.startsWith("audio/"))
    return "video";
  return "raw"; // pdf, zip, txt, etc.
}

export default async function uploadToCloudinary(
  buffer,
  mimetype,
  folder = "vaultbox"
) {
  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimetype};base64,${base64}`;
  const resourceType = getResourceType(mimetype);
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: resourceType,
  });

  return result;
}
