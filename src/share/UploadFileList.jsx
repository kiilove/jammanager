import { Button, Popconfirm, Typography } from "antd";
import React, { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;
export const UploadFileList = ({
  type = "list",
  dataSource = [],
  uploadTargetFileList = [],
  setUploadTargetFileList,
}) => {
  const [render, setRender] = useState(<div></div>);
  const [ellipsis, setEllipsis] = useState(true);
  const handleDelete = (list, idx) => {
    console.log(idx);
    const index = list[idx].index;
    console.log(index);

    if (index !== undefined && uploadTargetFileList.length > 0) {
      const newList = [...uploadTargetFileList];
      newList.splice(index, 1);
      dataSource.splice(idx, 1);
      setUploadTargetFileList(() => [...newList]);
    }
  };

  const ListRender = ({ list = [] }) => (
    <div className="flex w-full justify-start items-start flex-col">
      {list.length > 0 &&
        list.map((item, iIdx) => {
          return (
            <div className="flex w-full justify-start items-center" key={iIdx}>
              <div className="flex" style={{ width: "90%" }}>
                <Paragraph ellipsis={{ width: 200 }}>{item?.label}</Paragraph>
              </div>
              <div
                className="flex w-full justify-end items-center"
                style={{ width: "10%" }}
              >
                <Popconfirm
                  title="삭제확인"
                  description="이 파일을 삭제 하시겠습니까?"
                  onConfirm={() => {
                    return;
                  }}
                  onCancel={() => {
                    handleDelete(dataSource, iIdx);
                  }}
                  okText="아니오"
                  cancelText="예"
                  cancelButtonProps={{ danger: true }}
                  okButtonProps={{ type: "default" }}
                >
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    danger
                    style={{ border: "none" }}
                  />
                </Popconfirm>
              </div>
            </div>
          );
        })}
    </div>
  );

  return <>{type === "list" && <ListRender list={dataSource} />}</>;
};
