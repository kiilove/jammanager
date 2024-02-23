import React, { useContext, useEffect, useMemo, useRef } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import _, { size } from "lodash";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Table,
} from "antd";
import { IoApps } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
const CategorySetting = ({ onUpdate }) => {
  const [categoryForm] = Form.useForm();
  const { memberSettings } = useContext(CurrentLoginContext);
  const prevSettingsRef = useRef({
    companyName: "",
    isCompanyChildren: false,
    companyChildrenList: [],
    companyLogoFile: [],
  });

  const filteredCategories = useMemo(() => {
    const newCategories = [...memberSettings.assetCategories];

    const matchedData = newCategories.map((category, cIdx) => {
      let productLineData = [];
      if (category?.productLine?.length > 0) {
        productLineData = category.productLine.map((product, pIdx) => {
          const newValue = {
            key: `${cIdx}-${pIdx}`,
            name: product,
            action: (
              <div className="flex w-full justify-center items-center gap-1 flex-col md:flex-row">
                <div className="flex w-full h-full justify-center items-center">
                  <Button style={{ border: 0 }}>
                    <EditOutlined />
                  </Button>
                </div>
                <div className="flex w-full h-full justify-center items-center">
                  <Popconfirm
                    title="삭제"
                    description="품목을 삭제하시겠습니까?"
                    onConfirm={() => {
                      return;
                    }}
                    onCancel={() => {
                      return;
                    }}
                    okText="예"
                    cancelText="아니오"
                    okType="default"
                  >
                    <Button danger style={{ border: 0 }}>
                      <RiDeleteBin5Line />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            ),
            depreciationType: product?.depreciationType
              ? product.depreciationType
              : category.depreciationType,
            depreciationPeriod: product?.depreciationPeriod
              ? product.depreciationPeriod
              : category.depreciationPeriod,
          };
          return newValue;
        });
      }
      const newTableData = {
        key: cIdx,
        name: category.name,
        depreciationType: category.depreciationType,
        depreciationPeriod: category.depreciationPeriod,
        children: [...productLineData],
        action: (
          <div className="flex w-full justify-center items-center gap-1 flex-col md:flex-row">
            <div className="flex w-full h-full justify-center items-center">
              <Button style={{ border: 0 }}>
                <EditOutlined />
              </Button>
            </div>
            <div className="flex w-full h-full justify-center items-center">
              <Popconfirm
                title="삭제"
                description="분류를 삭제하시겠습니까?"
                onConfirm={() => {
                  return;
                }}
                onCancel={() => {
                  return;
                }}
                okText="예"
                cancelText="아니오"
                okType="default"
              >
                <Button danger style={{ border: 0 }}>
                  <RiDeleteBin5Line />
                </Button>
              </Popconfirm>
            </div>
          </div>
        ),
      };
      console.log(newTableData);
      return newTableData;
    });

    return matchedData;
  }, [memberSettings]);
  return (
    <Row gutter={8} className="w-full">
      <ConfigProvider
        theme={{
          components: {
            Input: { margin: 0, padding: 0 },
          },
        }}
      >
        <Form
          labelCol={{
            span: 16,
          }}
          style={{ width: "100%" }}
        >
          <Col span={24}>
            <Table
              size="small"
              dataSource={filteredCategories}
              columns={[
                {
                  key: 1,
                  title: "분류",
                  dataIndex: "name",
                  width: "50%",
                  fixed: "left",
                },
                {
                  key: 2,
                  title: "감가방식",
                  dataIndex: "depreciationType",
                  width: "20%",
                  fixed: true,
                },
                {
                  key: 3,
                  title: "감가기간(율)",
                  dataIndex: "depreciationPeriod",
                  width: "20%",
                  fixed: true,
                },
                {
                  key: 4,
                  title: (
                    <div className="flex w-full justify-center items-center">
                      <IoApps />
                    </div>
                  ),
                  dataIndex: "action",
                  width: "10%",
                  align: "center",
                  fixed: true,
                },
              ]}
            />
          </Col>
          <Col></Col>
        </Form>
      </ConfigProvider>
    </Row>
  );
};

export default CategorySetting;
