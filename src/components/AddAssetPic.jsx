import { Button, Upload, notification } from "antd";
import React, { useContext, useState } from "react";
import {
  convertTimestampToDate,
  generateFileName,
  generateUUID,
  handlePicAction,
} from "../functions";
import { CurrentLoginContext } from "../context/CurrentLogin";
import useImageUpload from "../hooks/useFireStorage";
import {
  PlusOutlined,
  UploadOutlined,
  MinusOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

const AddAssetPic = ({ assetInfo, setAssetInfo, picList, setPicList }) => {
  const [assetPics, setAssetPics] = useState([]);
  const assetPicUpload = useImageUpload();
  const assetPicDelete = useImageUpload();
  const { memberSettings, grouped, setGrouped, media } =
    useContext(CurrentLoginContext);
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    apiType,
    title,
    message,
    placement,
    duration,
    maxCount
  ) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
      maxCount,
    });
  };

  const handleListPicDelete = async (value, list, setList) => {
    const targetFile = `${value.storageUrl}/${value.name}`;
    try {
      await assetPicDelete.deleteFileFromStorage(targetFile).catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleAssetPicUploadAdd = async ({
    file,
    onSuccess,
    onError,
    index,
  }) => {
    const newFileName = generateFileName(file.name, generateUUID());
    const storageUrl = `/assetPics/${memberSettings.userID}`;

    try {
      const result = await assetPicUpload.uploadImage(
        storageUrl,
        file,
        newFileName
      );
      //const newFirstPics = [...assetFirstPics];
      //console.log(result);
      if (result.success) {
        const today = new Date();
        const todayConverted = dayjs(today).format("YYYY-MM-DD");
        const newFile = {
          storageUrl,
          name: newFileName,
          url: result.downloadUrl,
          status: "uploaded",
          createdAt: Timestamp.fromDate(today),
          createdAtConverted: todayConverted,
        };
        handlePicAction(newFile, assetPics, setAssetPics);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      onError(error);
    }
  };

  useEffect(() => {
    console.log(assetPics);
    const newList = assetPics.filter((f) => f.status === "uploaded");
    setPicList(() => [...newList]);
    setAssetInfo(() => ({
      ...assetInfo,
      assetPics: assetInfo?.assetPics
        ? [...assetInfo?.assetPics, ...newList]
        : [...newList],
    }));
  }, [assetPics]);

  return (
    <Upload
      listType="picture-card"
      fileList={assetPics.filter((f) => f.status === "uploaded")}
      onRemove={(value) => handleListPicDelete(value, assetPics, setAssetPics)}
      onChange={(value) => handlePicAction(value.file, assetPics, setAssetPics)}
      customRequest={({ file, onSuccess, onError }) =>
        handleAssetPicUploadAdd({
          file,
          onSuccess,
          onError,
        })
      }
    >
      {assetPics.filter((f) => f.status === "uploaded").length <= 2 && (
        <Button icon={<UploadOutlined />} />
      )}
    </Upload>
  );
};

export default AddAssetPic;
