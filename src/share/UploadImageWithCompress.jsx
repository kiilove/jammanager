import Upload from "antd/es/upload/Upload";
import React, { useEffect, useState } from "react";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";

export const UploadImageWithCompress = ({
  uploadTargetFileList = [],
  setUploadTargetFileList,
  index,
}) => {
  const [imagePreview, setImagePreview] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);

  const beforeUpload = (file) => {
    const fileUrl = URL.createObjectURL(file);
    const newList = [...uploadTargetFileList];
    newList[index] = file;
    console.log(newList);

    setUploadTargetFileList([...newList]);
    setImagePreview((prev) => [...prev, fileUrl]);
  };

  const handleTargetDelete = (index) => {
    const newTargetList = [...uploadTargetFileList];
    const newPreview = [...imagePreview];

    newTargetList.splice(index, 1);
    newPreview.splice(index, 1);

    setUploadTargetFileList(newTargetList);
    setImagePreview(newPreview);
  };

  return (
    <>
      {/* {imagePreview.length === 0 && (
        <div className="flex w-full justify-center items-center">
          <Upload
            listType="picture-card"
            fileList={uploadTargetFileList[index]}
            beforeUpload={beforeUpload}
            showUploadList={false}
          >
            <button>사진 추가</button>
          </Upload>
        </div>
      )} */}
      <div className="flex w-full justify-center items-center">
        <Upload
          listType="picture-card"
          fileList={
            uploadTargetFileList[index] === undefined
              ? []
              : uploadTargetFileList[index]
          }
          beforeUpload={beforeUpload}
          showUploadList={false}
        >
          <button>사진 추가</button>
        </Upload>
      </div>
    </>
  );
};
