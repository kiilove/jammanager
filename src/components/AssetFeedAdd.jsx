import React, { useContext, useState } from "react";
import { Timestamp, where } from "firebase/firestore";
import { FeedActionBar, UploadMedias } from "../share/Index";
import { SendOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { Button, Progress, Upload, notification } from "antd";
import { useEffect } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import dayjs from "dayjs";
import useImageUpload from "../hooks/useFireStorage";
import { generateFileName, generateUUID } from "../functions";
import { useFirestoreAddData } from "../hooks/useFirestore";

const AssetFeedAdd = ({ data, setClose }) => {
  const [actions, setActions] = useState({
    medias: false,
  });
  const [uploadTargetFileList, setUploadTargetFileList] = useState([]);
  const [isError, setIsError] = useState({ isError: false, message: "" });
  const [isProgressing, setIsProgressing] = useState(false);
  const [progressingValue, setProgressingValue] = useState(0);
  const [fileListItem, setFileListItem] = useState([]);

  const [feedTextArea, setFeedTextArea] = useState("");
  const [feedType, setFeedType] = useState("일반");
  const feedUpload = useImageUpload();
  const feedAdd = useFirestoreAddData();

  const { loginInfo } = useContext(CurrentLoginContext);

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

  const initFeed = () => {
    setActions({ medias: false });
    setUploadTargetFileList([]);
    setIsProgressing(false);
    setProgressingValue(0);
    setFileListItem([]);
    setFeedTextArea("");
    setFeedType("일반");
    setClose(() => ({ open: false, data: null }));
  };
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

  const handleMediasUpload = async (targets = [], storageURI) => {
    let uploadedInfo = [];
    if (targets.length > 0) {
      setIsProgressing(true);
      let currentIndex = 0; // 현재 처리 중인 업로드 항목의 인덱스를 추적합니다.
      for (const upload of targets) {
        try {
          const fileName = generateUUID();
          const result = await feedUpload.uploadFile(
            storageURI,
            upload,
            fileName
          );
          uploadedInfo.push(result);

          currentIndex++; // 다음 업로드 항목으로 인덱스를 업데이트합니다.
          const progress = (currentIndex / targets.length) * 100; // 진행 상태를 계산합니다.
          setProgressingValue(progress); // 진행 상태를 업데이트합니다.
        } catch (error) {
          console.log(error);
          setIsError(() => ({ isError: true, message: error.message }));
        }
      }
      setIsProgressing(false);
    }
    return uploadedInfo;
  };

  const handleFeedAdd = async (value) => {
    if (!value) {
      openNotification(
        "error",
        "이력등록실패",
        "이력등록에 실패했습니다.",
        "top"
      );
      return;
    }
    console.log(value);

    try {
      await feedAdd.addData("assetFeeds", value, () =>
        openNotification(
          "success",
          "이력등록완료",
          "이력등록을 완료했습니다.",
          "top"
        )
      );
    } catch (error) {
      openNotification("error", "이력등록실패", error.message, "top");
    }
  };

  const onFinish = async () => {
    let createdBy = "";
    if (loginInfo.uid) {
      createdBy = "관리자";
    }

    const storageURI = "/feedMedias";
    const feedPics = await handleMediasUpload(uploadTargetFileList, storageURI);

    const nowDate = dayjs(new Date());
    const createdAtConverted = dayjs(nowDate).format("YYYY-MM-DD");
    const createdAt = Timestamp.fromDate(nowDate.toDate());
    const newValue = {
      refAssetID: data?.id,
      refAssetCode: data?.assetCode,
      createdBy,
      createdAt,
      createdAtConverted,
      actionAt: createdAt,
      actionAtConverted: createdAtConverted,
      feedPics,
      feedContext: feedTextArea,
      feedType,
    };

    handleFeedAdd({ ...newValue });
  };

  useEffect(() => {
    setFileListItem(handleFileList(uploadTargetFileList));
  }, [uploadTargetFileList]);

  return (
    <div className="flex w-full flex-col gap-y-2">
      <FeedActionBar
        actions={actions}
        setActions={setActions}
        feedType={feedType}
        setFeedType={setFeedType}
        attached={uploadTargetFileList?.length > 0 ? true : false}
      />
      <div className="flex w-full">{data?.assetName}</div>
      <div
        className="flex w-full justify-center items-start gap-x-1  box-border relative"
        style={{ minHeight: "50px", height: "70px" }}
      >
        <div
          className="flex h-full justify-center items-start"
          style={{ width: "90%" }}
        >
          <TextArea
            style={{ resize: "none", height: "70px" }}
            placeholder="기록할 내용을 작성해주세요."
            onChange={(e) => setFeedTextArea(e.target.value)}
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
            onClick={() => onFinish()}
          />
        </div>
        {isProgressing && (
          <div className="absolute top-20 flex w-full h-full justify-center items-center z-10">
            <Progress percent={progressingValue} type="circle" />
          </div>
        )}
      </div>
      {/* <div className="flex w-full" key="actionCanvasFiles">
        <UploadFileList
          dataSource={fileListItem}
          uploadTargetFileList={uploadTargetFileList}
          setUploadTargetFileList={setUploadTargetFileList}
        />
      </div> */}
      <div className="flex w-full" key="actionCanvas1">
        {actions.medias && (
          <UploadMedias
            uploadTargetFileList={uploadTargetFileList}
            setUploadTargetFileList={setUploadTargetFileList}
          />
        )}
      </div>
      {contextHolder}
    </div>
  );
};

export default AssetFeedAdd;
