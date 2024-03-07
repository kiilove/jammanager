import React from "react";
import useImageUpload from "../hooks/useFireStorage";

export const OnUploadByAntd = async ({
  storageURI,
  file,
  onSuccess,
  onError,
}) => {
  const uploadFile = useImageUpload();
  const newFileName = generateFileName(file.name, generateUUID());
  const storageUrl = storageURI;

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
      setUploadState(() => ({ ...newFile }));
      onSuccess();
    } else {
      setUploadState(() => ({ status: "error" }));
      onError();
    }
  } catch (error) {
    console.error(error);
  }
};
