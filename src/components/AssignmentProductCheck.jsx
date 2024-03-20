import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Rate,
  Row,
  Space,
  Switch,
  Table,
  Tooltip,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { MdOutlineRefresh } from "react-icons/md";
import { MdHelpCenter } from "react-icons/md";
import React, { useState } from "react";
import { useEffect } from "react";

const AssignmentProductCheck = ({ data, productInfo, setProductInfo }) => {
  const [assetAccessory, setAssetAccessory] = useState([]);
  const [currentAssetAccessory, setCurrentAssetAccessory] = useState({
    name: "",
    count: "",
  });

  const handleAssetAccessory = (list, action, index, value) => {
    console.log(index);
    const newList = [...list];

    if (action === "add") {
      newList.push({ index, ...value });
    } else if (action === "remove") {
      newList.splice(index, 1);
    }

    console.log(newList);

    setProductInfo(() => ({ ...productInfo, assetAccessory: [...newList] }));
    setCurrentAssetAccessory({ name: "", count: "" });
  };

  useEffect(() => {
    if (productInfo?.assetAccessory?.length > 0) {
      setAssetAccessory([...productInfo.assetAccessory]);
    }
  }, [productInfo]);

  return (
    <Form
      labelCol={{
        span: 4,
      }}
      colon={false}
      style={{
        width: "100%",
      }}
      labelAlign="left"
    >
      <Form.Item label="작동여부">
        <Switch
          checked={productInfo?.assetWorking}
          onChange={(value) =>
            setProductInfo(() => ({ ...productInfo, assetWorking: value }))
          }
        />
      </Form.Item>
      <Form.Item label="외관상태">
        <Rate
          allowHalf
          value={productInfo?.assetExterior}
          onChange={(value) =>
            setProductInfo(() => ({ ...productInfo, assetExterior: value }))
          }
        />
      </Form.Item>
      <Form.Item label="구성품">
        <Space className="w-full mb-2">
          <Input
            placeholder="품목"
            value={currentAssetAccessory.name}
            onChange={(e) =>
              setCurrentAssetAccessory({
                ...currentAssetAccessory,
                name: e.target.value,
              })
            }
          />
          <InputNumber
            placeholder="수량"
            value={currentAssetAccessory.count}
            onChange={(value) =>
              setCurrentAssetAccessory({
                ...currentAssetAccessory,
                count: value,
              })
            }
          />
          <Button
            disabled={
              currentAssetAccessory.name === "" ||
              currentAssetAccessory.count === "" ||
              currentAssetAccessory.name === undefined ||
              currentAssetAccessory.count === undefined
            }
            onClick={() => {
              handleAssetAccessory(
                assetAccessory,
                "add",
                assetAccessory.length + 1,
                currentAssetAccessory
              );
            }}
          >
            추가
          </Button>
          <Tooltip
            color="blue"
            title={
              <div className="flex flex-col" style={{ fontSize: 12 }}>
                <span>빠른 배정을 위한 목록입니다.</span>
                <span>자산 내용에는 반영되지 않습니다.</span>
                <span>자산 수정에서 변경이 가능합니다.</span>
              </div>
            }
          >
            <Button
              icon={<MdHelpCenter style={{ fontSize: 20 }} />}
              className="flex w-full h- full justify-center items-center text-blue-500"
              style={{ border: "none" }}
            />
          </Tooltip>
        </Space>
        <Table
          size="small"
          columns={[
            {
              title: <span className="font-normal">순번</span>,
              width: 50,
              dataIndex: "index",
            },
            {
              title: <span className="font-normal">품목</span>,
              width: 500,
              dataIndex: "name",
            },
            {
              title: <span className="font-normal">수량</span>,

              width: 200,
              dataIndex: "count",
            },
            {
              title: (
                <Button
                  icon={<MdOutlineRefresh style={{ fontSize: 18 }} />}
                  className="flex w-full h- full justify-center items-center"
                  style={{ border: "none" }}
                  onClick={() =>
                    setProductInfo(() => ({
                      ...productInfo,
                      assetAccessory: data?.assetAccessory,
                    }))
                  }
                />
              ),
              key: "action",
              render: (_, record) => {
                return (
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    style={{ border: "none" }}
                    onClick={() =>
                      handleAssetAccessory(
                        assetAccessory,
                        "remove",
                        record.index - 1
                      )
                    }
                  />
                );
              },
            },
          ]}
          dataSource={assetAccessory}
          pagination={false}
          style={{
            width: "100%",
            backgroundColor: "#f5f5f5",
            borderRadius: 5,
          }}
        />
      </Form.Item>
    </Form>
  );
};

export default AssignmentProductCheck;
