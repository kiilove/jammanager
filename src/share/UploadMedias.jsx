import Upload from "antd/es/upload/Upload";
import React, { useEffect, useState } from "react";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";

export const UploadMedias = ({
  uploadTargetFileList = [],
  setUploadTargetFileList,
  setUploadState,
}) => {
  const [imagePreview, setImagePreview] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);

  const beforeUpload = (file) => {
    const fileUrl = URL.createObjectURL(file);
    setUploadTargetFileList((prev) => [...prev, file]);
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
    <div
      className="w-full flex justify-start items-center flex-col"
      style={{ minHeight: "50px", height: "100%" }}
    >
      {imagePreview.length === 0 && (
        <div className="flex w-full justify-center items-center">
          <Upload
            fileList={uploadTargetFileList}
            beforeUpload={beforeUpload}
            showUploadList={false}
          >
            <Button size="large" className="bg-white" icon={<UploadOutlined />}>
              사진/동영상 추가
            </Button>
          </Upload>
        </div>
      )}
      <div>
        {imagePreview.length > 0 &&
          imagePreview.map((file, index) => (
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
                          사진/동영상 추가
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
              <img src={file} alt="preview" style={{ width: "100%" }} />
            </div>
          ))}
      </div>
    </div>
  );
};
