import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import _, { set } from "lodash";
import {
  Button,
  Col,
  ConfigProvider,
  Dropdown,
  Form,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Table,
} from "antd";
import { IoApps } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  EditOutlined,
  FolderAddOutlined,
  EllipsisOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import AssetCategoryModal from "./AssetCategoryModal";
import { initCategory } from "../InitValues";
import AssetProductLineModal from "./AssetProductLineModal";

const CategorySetting = ({ onUpdate }) => {
  const [modalOpen, setModalOpen] = useState({
    visible: false,
    component: null,
  });
  const [assetCategories, setAssetCategories] = useState([]);
  const [currentProductLine, setCurrentProductLine] = useState([]);
  const [currentParentIndex, setCurrentParentIndex] = useState(0);
  const [isChanged, setIsChanged] = useState(false);

  const { memberSettings } = useContext(CurrentLoginContext);
  const prevSettingsRef = useRef({
    assetCategories: [],
    productLine: [],
  });
  const { confirm } = Modal;

  const handleRemoveCategory = (data, setData, index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(() => [...newData]);
  };

  const handleRemoveProduct = (data, setData, parentIndex, index) => {
    const newData = [...data];
    const currentData = newData[parentIndex];
    currentData.productLine.splice(index, 1);

    newData.splice(index, 1, currentData);
    setData(() => [...newData]);
  };
  const drawHeaderItem = (index) => {
    return [
      {
        key: "0",
        icon: <EditOutlined />,
        label: <span className="text-xs">분류추가</span>,
        onClick: () => {
          setModalOpen(() => ({
            visible: true,
            component: (
              <AssetCategoryModal
                action="add"
                data={assetCategories}
                setData={setAssetCategories}
                setClose={setModalOpen}
              />
            ),
          }));
        },
      },
    ];
  };

  const deleteConfirm = ({ title, index }) => {
    confirm({
      title: `${title}을 정말 삭제하시겠습니까?`,
      icon: <ExclamationCircleFilled />,
      content: "기존 자산 수정에 문제를 일으킬 수 있습니다.",
      okType: "default",
      okText: "아니오",
      cancelText: "예",
      onOk() {
        return;
      },
      onCancel() {
        handleRemoveCategory(assetCategories, setAssetCategories, index);
      },
    });
  };

  const deleteProductConfirm = ({ title, parentIndex, index }) => {
    confirm({
      title: `${title}을 정말 삭제하시겠습니까?`,
      icon: <ExclamationCircleFilled />,
      content: "기존 자산 수정에 문제를 일으킬 수 있습니다.",
      okType: "default",
      okText: "아니오",
      cancelText: "예",
      onOk() {
        return;
      },
      onCancel() {
        handleRemoveProduct(
          assetCategories,
          setAssetCategories,
          parentIndex,
          index
        );
      },
    });
  };

  const initCategoriesConfirm = () => {
    confirm({
      title: `자산 분류 초기화`,
      icon: <ExclamationCircleFilled />,
      content: "기존 자산 수정에 문제를 일으킬 수 있습니다.",
      okType: "default",
      okText: "아니오",
      cancelText: "예",
      onOk() {
        return;
      },
      onCancel() {
        setAssetCategories(() => [...initCategory]);
      },
    });
  };

  const drawCategryItem = (value, index, list) => {
    return [
      {
        key: "0",
        icon: <FolderAddOutlined />,
        label: <span className="text-xs">{`${value?.name} 하위품목추가`}</span>,
        onClick: () => {
          setCurrentParentIndex(index);
          setModalOpen(() => ({
            visible: true,
            component: (
              <AssetProductLineModal
                action="add"
                data={assetCategories}
                setData={setAssetCategories}
                setClose={setModalOpen}
                index={null}
                parentIndex={index}
              />
            ),
          }));
        },
      },
      {
        key: "1",
        icon: <EditOutlined />,
        label: <span className="text-xs">{`${value?.name} 수정`}</span>,
        onClick: () => {
          setModalOpen(() => ({
            visible: true,
            component: (
              <AssetCategoryModal
                action="edit"
                data={assetCategories}
                setData={setAssetCategories}
                setClose={setModalOpen}
                index={index}
              />
            ),
          }));
        },
      },
      {
        key: "2",
        icon: <RiDeleteBin5Line />,
        label: <span className="text-xs">{`${value?.name} 삭제`}</span>,
        onClick: () => deleteConfirm({ title: value?.name, index }),
      },
    ];
  };

  const drawProductLineItem = (value, parentIndex, index, list) => {
    return [
      {
        key: "0",
        icon: <EditOutlined />,
        label: (
          <span className="text-xs">{`${value?.name || value} 수정`}</span>
        ),
        onClick: () => {
          setCurrentParentIndex(parentIndex);
          setModalOpen(() => ({
            visible: true,
            component: (
              <AssetProductLineModal
                action="edit"
                data={assetCategories}
                setData={setAssetCategories}
                setClose={setModalOpen}
                index={index}
                parentIndex={parentIndex}
                setProductLine={currentProductLine}
              />
            ),
          }));
        },
      },
      {
        key: "1",
        icon: <RiDeleteBin5Line />,
        label: (
          <span className="text-xs">{`${value?.name || value} 삭제`}</span>
        ),
        onClick: () => {
          deleteProductConfirm({ title: value?.name, parentIndex, index });
        },
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

  const filteredCategories = useMemo(() => {
    const newCategories = [...assetCategories];

    const matchedData = newCategories.map((category, cIdx) => {
      let productLineData = [];
      if (category?.productLine?.length > 0) {
        productLineData = category.productLine.map((product, pIdx) => {
          const newValue = {
            key: `${cIdx}-${pIdx}`,
            name: product.name,
            action: (
              <Dropdown
                overlay={
                  <Menu
                    items={drawProductLineItem(
                      product,
                      cIdx,
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

      return newTableData;
    });

    return matchedData;
  }, [assetCategories]);

  const requestUpdate = (value, msg) => {
    const newValue = {
      ...value,
      assetCategories,
    };

    onUpdate(value.id, newValue, msg);
  };
  useEffect(() => {
    setAssetCategories(() => [...memberSettings.assetCategories]);
  }, [memberSettings]);

  const settingsHaveChanged = () => {
    const prevSettings = prevSettingsRef.current;
    return !_.isEqual(prevSettings, {
      assetCategories,
      productLine: currentProductLine,
    });
  };

  useEffect(() => {
    console.log(assetCategories);
    if (assetCategories.length > 0) {
      setCurrentProductLine(
        (prev) =>
          [...assetCategories[currentParentIndex]?.productLine] || [...prev]
      );
    }

    setIsChanged(settingsHaveChanged());
    if (memberSettings.isSettingAutoSave && settingsHaveChanged()) {
      requestUpdate({ ...memberSettings }, false);
    }
    prevSettingsRef.current = {
      assetCategories,
      productLine: currentProductLine,
    };
  }, [memberSettings.isSettingAutoSave, assetCategories, currentParentIndex]);

  useEffect(() => {
    console.log(currentProductLine);
    if (assetCategories[currentParentIndex]?.productLine?.length > 0) {
      setCurrentProductLine(() => [
        ...assetCategories[currentParentIndex].productLine,
      ]);
    }
  }, [currentParentIndex]);

  return (
    <Row gutter={8} className="w-full">
      <ConfigProvider
        theme={{
          components: {
            Input: { margin: 0, padding: 0 },
          },
        }}
      >
        <Modal
          open={modalOpen.visible}
          mask={false}
          maskClosable={false}
          keyboard={false}
          footer={null}
          onCancel={() => setModalOpen({ visible: false, component: null })}
        >
          {modalOpen.component}
        </Modal>
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
              pagination={false}
            />
          </Col>
          <Col></Col>
        </Form>
        <div className="flex w-full justify-end mt-5 gap-x-2">
          <Button danger onClick={initCategoriesConfirm}>
            분류 초기화
          </Button>{" "}
          <Button
            htmlType="submit"
            type="primary"
            className="bg-blue-500 "
            onClick={() =>
              requestUpdate(
                {
                  ...memberSettings,
                },
                true
              )
            }
          >
            저장
          </Button>
          {/* {memberSettings.isSettingAutoSave ? (
            <span className="text-gray-400 font-semibold text-xs">
              자동저장사용중
            </span>
          ) : isChanged ? (
            <Button
              htmlType="submit"
              type="primary"
              className="bg-blue-500 "
              onClick={() =>
                requestUpdate(
                  {
                    ...memberSettings,
                  },
                  true
                )
              }
            >
              저장
            </Button>
          ) : null} */}
        </div>
      </ConfigProvider>
    </Row>
  );
};

export default CategorySetting;
