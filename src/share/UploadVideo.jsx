import React, { useEffect, useState } from "react";
import { Upload, Button, Popconfirm } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";

export const UploadVideo = ({
  uploadTargetFileList = [],
  setUploadTargetFileList,
  setUploadState,
}) => {
  const [videoPreview, setVideoPreview] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);

  const beforeUpload = (file) => {
    const fileUrl = URL.createObjectURL(file);
    setVideoPreview(() => [...videoPreview, fileUrl]);
    // 파일 리스트 상태 업데이트를 위한 논리 (실제 업로드 프로세스와 통합하기)
    setUploadTargetFileList((prevList) => [...prevList, file]);
    // 기본 이벤트를 방지하여 파일이 바로 업로드되지 않도록 함
    return false;
  };

  const handleTargetDelete = (index) => {
    const newTargetList = [...uploadTargetFileList];
    const newPreview = [...videoPreview];

    newTargetList.splice(index, 1);
    newPreview.splice(index, 1);

    setUploadTargetFileList(newTargetList);
    setVideoPreview(newPreview);
  };

  useEffect(() => {
    return () => {
      setVideoPreview([]);
    };
  }, []);

  return (
    <div
      className="w-full flex justify-start items-center flex-col"
      style={{ minHeight: "50px", height: "100%" }}
    >
      {videoPreview.length === 0 && (
        <div className="flex w-full justify-center items-center">
          <Upload
            fileList={uploadTargetFileList}
            beforeUpload={beforeUpload}
            showUploadList={false}
          >
            <Button size="large" className="bg-white" icon={<UploadOutlined />}>
              영상추가
            </Button>
          </Upload>
        </div>
      )}
      {videoPreview.length > 0 &&
        videoPreview.map((video, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredImage(index)} // 마우스가 이미지 위에 올라가면 해당 이미지의 인덱스를 설정
            onMouseLeave={() => setHoveredImage(null)} // 마우스가 이미지에서 벗어나면 호버 상태를 초기화
            style={{ position: "relative", width: "100%" }}
          >
            {hoveredImage === index && ( // 현재 호버된 이미지의 인덱스와 매핑되는 경우에만 div 표시
              <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
                <div className="flex w-full h-full justify-center items-start p-5">
                  <div className="flex w-full justify-between">
                    <Upload
                      fileList={uploadTargetFileList}
                      beforeUpload={beforeUpload}
                      showUploadList={false}
                    >
                      <Button
                        size="large"
                        className="bg-white"
                        icon={<UploadOutlined />}
                      >
                        영상추가
                      </Button>
                    </Upload>
                    <Popconfirm
                      title="삭제확인"
                      description="이 파일을 삭제 하시겠습니까?"
                      onConfirm={() => {
                        return;
                      }}
                      onCancel={() => {
                        handleTargetDelete(index);
                      }}
                      okText="아니오"
                      cancelText="예"
                      cancelButtonProps={{
                        danger: true,
                        style: { width: 60 },
                      }}
                      okButtonProps={{
                        type: "default",
                        style: { width: 60 },
                      }}
                    >
                      <Button
                        size="large"
                        className="bg-white"
                        icon={<CloseOutlined />}
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </Popconfirm>
                  </div>
                </div>
              </div>
            )}
            <video
              controls
              width="100%"
              src={video}
              style={{ marginBottom: "20px" }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
    </div>
  );
};
