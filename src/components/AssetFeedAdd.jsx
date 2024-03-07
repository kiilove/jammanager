import React, { useState } from "react";
import {
  FeedActionBar,
  UploadFileList,
  UploadImage,
  UploadVideo,
} from "../share/Index";
import { SendOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { Button, Upload } from "antd";
import { useEffect } from "react";

const AssetFeedAdd = ({ data }) => {
  const [actions, setActions] = useState({
    pic: false,
    video: false,
    file: false,
  });
  const [uploadTargetFileList, setUploadTargetFileList] = useState([]);
  const [fileListItem, setFileListItem] = useState([]);

  const handleFileList = (data = []) => {
    let items = [];
    if (data.length > 0) {
      items = data.map((item, iIdx) => {
        const fileType = item.type.split("/");
        return { label: item.name, index: iIdx, type: fileType[0] || "" };
      });
    }

    return items;
  };

  useEffect(() => {
    setFileListItem(handleFileList(uploadTargetFileList));
  }, [uploadTargetFileList]);

  useEffect(() => {
    console.log(data);
    const promises = [setUploadTargetFileList([]), setFileListItem([])];
    Promise.all(promises);
  }, [data]);

  return (
    <div className="flex w-full flex-col gap-y-2">
      <FeedActionBar actions={actions} setActions={setActions} />
      <div className="flex w-full">{data?.assetName}</div>
      <div
        className="flex w-full justify-center items-start gap-x-1  box-border"
        style={{ minHeight: "50px", height: "70px" }}
      >
        <div
          className="flex h-full justify-center items-start"
          style={{ width: "90%" }}
        >
          <TextArea
            style={{ resize: "none", height: "70px" }}
            placeholder="기록할 내용을 작성해주세요."
          />
        </div>
        <div
          className="flex h-full justify-center items-start"
          style={{ width: "10%" }}
        >
          <Button
            size="large"
            icon={<SendOutlined style={{ fontSize: 24 }} />}
            type="primary"
            className="bg-blue-500"
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>
      {/* <div className="flex w-full" key="actionCanvasFiles">
        <UploadFileList
          dataSource={fileListItem}
          uploadTargetFileList={uploadTargetFileList}
          setUploadTargetFileList={setUploadTargetFileList}
        />
      </div> */}
      <div className="flex w-full" key="actionCanvas1">
        {actions.pic && (
          <UploadImage
            uploadTargetFileList={uploadTargetFileList}
            setUploadTargetFileList={setUploadTargetFileList}
          />
        )}
      </div>
      <div className="flex w-full" key="actionCanvas2">
        {actions.video && (
          <UploadVideo
            uploadTargetFileList={uploadTargetFileList}
            setUploadTargetFileList={setUploadTargetFileList}
          />
        )}
      </div>
    </div>
  );
};

export default AssetFeedAdd;
