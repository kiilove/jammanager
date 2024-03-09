import React, { useState } from "react";
import useImageUpload from "../hooks/useFireStorage";
import { generateFileName, generateUUID } from "../functions";

export const OnUploadByAntd = async (storageURI, file) => {
  const [uploadState, setUploadState] = useState();
  const uploadFile = useImageUpload();
  const newFileName = generateFileName(file.name, generateUUID());
  const storageUrl = storageURI;
  let uploadResult = {};

  try {
    const result = await uploadFile.uploadFile(storageUrl, file, newFileName);
    //const newFirstPics = [...assetFirstPics];
    if (result.success) {
      const newFile = {
        storageUrl,
        name: newFileName,
        url: result.downloadUrl,
        status: "uploaded",
      };
      uploadResult = { ...newFile };
      setUploadState(() => ({ ...newFile }));
    } else {
      uploadResult = { status: "error" };
      setUploadState(() => ({ status: "error" }));
    }
  } catch (error) {
    console.error(error);
  }

  return uploadResult;
};
