import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import _ from "lodash";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Dropdown,
  Form,
  Input,
  Menu,
  Popconfirm,
  Row,
  Select,
  Table,
} from "antd";
import { IoApps } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import {
  EditOutlined,
  UserOutlined,
  FolderAddOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
const CategorySetting = ({ onUpdate }) => {
  const [modalOpen, setModalOpen] = useState({
    header: false,
    category: false,
    productLine: false,
  });
  const [categoryForm] = Form.useForm();
  const { memberSettings } = useContext(CurrentLoginContext);
  const prevSettingsRef = useRef({
    companyName: "",
    isCompanyChildren: false,
    companyChildrenList: [],
    companyLogoFile: [],
  });
  const drawHeaderItem = (index) => {
    return [
      {
        key: "0",
        icon: <EditOutlined />,
        label: <span className="text-xs">분류추가</span>,
      },
    ];
  };

  const categoryColumn = [
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
        <Dropdown overlay={<Menu items={drawHeaderItem()} />}>
          <div className="flex w-full justify-center items-center">
            <a onClick={(e) => e.preventDefault()}>
              <IoApps style={{ fontSize: "20px" }} />
            </a>
          </div>
        </Dropdown>
      ),
      width: "10%",
      align: "center",
      fixed: true,
      dataIndex: "action",
    },
  ];

  const drawCategryItem = (value, index, list) => {
    return [
      {
        key: "0",
        icon: <FolderAddOutlined />,
        label: <span className="text-xs">{`${value?.name} 하위품목추가`}</span>,
      },
      {
        key: "1",
        icon: <EditOutlined />,
        label: <span className="text-xs">{`${value?.name} 수정`}</span>,
      },
      {
        key: "2",
        icon: <RiDeleteBin5Line />,
        label: <span className="text-xs">{`${value?.name} 삭제`}</span>,
      },
    ];
  };
  const drawProductLineItem = (value, index, list) => {
    return [
      {
        key: "0",
        icon: <EditOutlined />,
        label: (
          <span className="text-xs">{`${value?.name || value} 수정`}</span>
        ),
      },
      {
        key: "1",
        icon: <RiDeleteBin5Line />,
        label: (
          <span className="text-xs">{`${value?.name || value} 삭제`}</span>
        ),
      },
    ];
  };

  const renderCategoryModal = () => {};

  const filteredCategories = useMemo(() => {
    const newCategories = [...memberSettings.assetCategories];

    const matchedData = newCategories.map((category, cIdx) => {
      let productLineData = [];
      if (category?.productLine?.length > 0) {
        productLineData = category.productLine.map((product, pIdx) => {
          console.log(product);
          const newValue = {
            key: `${cIdx}-${pIdx}`,
            name: product.name,
            action: (
              <Dropdown
                overlay={
                  <Menu
                    items={drawProductLineItem(
                      product,
                      pIdx,
                      category?.productLine || []
                    )}
                  />
                }
              >
                <a onClick={(e) => e.preventDefault()}>
                  <EllipsisOutlined style={{ fontSize: "20px" }} />
                </a>
              </Dropdown>
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
          <Dropdown
            overlay={
              <Menu items={drawCategryItem(category, cIdx, newCategories)} />
            }
          >
            <a onClick={(e) => e.preventDefault()}>
              <EllipsisOutlined style={{ fontSize: "20px" }} />
            </a>
          </Dropdown>
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
              columns={categoryColumn}
            />
          </Col>
          <Col></Col>
        </Form>
      </ConfigProvider>
    </Row>
  );
};

export default CategorySetting;
