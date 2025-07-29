import cloudinary from "./cloudinary.js";

export default async function uploadToCloudinary(
  buffer,
  mimetype,
  folder = "vaultbox"
) {
  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimetype};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "auto",
  });

  return result;
}
