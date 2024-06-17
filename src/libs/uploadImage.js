import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

import { storage } from "../firebase/config.js";

export default async (buffer, fileName) => {
  const storageRef = ref(
    storage,
    fileName + "-" + uuidv4().slice(0, 8) + ".jpg"
  );

  const processedImageBuffer = await sharp(buffer)
    .jpeg({ quality: 50 })
    .toBuffer();

  return await uploadBytes(storageRef, processedImageBuffer, {
    // contentType: "application/octet-stream",
    contentType: "image/jpeg",
  }).then((snapshot) => {
    return getDownloadURL(snapshot.ref).then((url) => {
      return url;
    });
  });
};
