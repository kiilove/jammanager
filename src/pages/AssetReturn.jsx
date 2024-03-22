import {
  Card,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Rate,
  Row,
  Select,
  Switch,
  Table,
  Tabs,
  notification,
} from "antd";
import React, { useContext, useState } from "react";
import { navigateMenus } from "../navigate";
import { useLocation } from "react-router-dom";
import PageContainer from "../layout/PageContainer";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { useEffect } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import SelectItem from "../share/SelectItem";
import AssetAgreementView from "../components/AssetAgreementView";
import AssetAgreementPics from "../components/AssetAgreementPics";

const AssetReturn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [assetAccessoryData, setAssetAccessoryData] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState({});
  const location = useLocation();
  const [modalProp, setModalProp] = useState({ open: false, data: "" });
  const { media } = useContext(CurrentLoginContext);
  const [form] = Form.useForm();

  const documentQuery = useFirestoreQuery();
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
  const fetchDocuments = async (UID) => {
    const condition = [where("assetUID", "==", UID)];
    try {
      await documentQuery
        .getDocuments(
          "assetDocuments",
          (data) => {
            console.log(data);
            handleCurrentAssignment(data, setCurrentAssignment);
            setDocumentList(() => [...data]);
          },
          condition
        )
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCurrentAssignment = (list, setList) => {
    const newList = [...list];
    const filterList = newList.filter(
      (f) => f.docuActive === true && f.docuType === "assetUserAgreement"
    );

    if (filterList.length === 0) {
      openNotification(
        "error",
        "불러오기 실패",
        "정상적인 배정 내역을 불러오지 못했습니다.",
        "top",
        3
      );
      return;
    }
    if (filterList.length > 1) {
      modalProp({ open: true, data: filterList });
    }

    if (filterList.length === 1) {
      setList(() => ({ ...list[0] }));
    }
  };

  const tabItems = [
    {
      key: 1,
      label: "배정당시정보",
      children: <AssetAgreementView data={currentAssignment} />,
    },
    {
      key: 2,
      label: "배정당시사진",
      children: <AssetAgreementPics data={currentAssignment?.assetPics} />,
    },
  ];

  const checkList = [
    {
      key: 1,
      field: "작동여부",
      items: (
        <Radio.Group
          options={[
            { key: 1, label: "정상", value: true },
            { key: 2, label: "비정상", value: false },
          ]}
        ></Radio.Group>
      ),
    },
    {
      key: 2,
      field: "제품외관",
      items: <Rate allowHalf allowClear />,
    },
    {
      key: 3,
      field: "구성품",
      items: (
        <Radio.Group
          options={[
            { key: 1, label: "모두정상", value: true },
            { key: 2, label: "일부비정상", value: false },
          ]}
        ></Radio.Group>
      ),
      children: assetAccessoryData,
    },
  ];

  useEffect(() => {
    if (currentAssignment?.assetAccessory?.length > 0) {
      const accessoryData = currentAssignment.assetAccessory.map(
        (item, idx) => {
          const { name, count } = item;

          const newValue = {
            key: idx + 1,
            field: name,
            items: count,
            action: (
              <div className="w-full flex-wrap box-border gap-x-4">
                <Radio.Group
                  options={[
                    { key: 1, label: "정상", value: true },
                    { key: 2, label: "비정상", value: false },
                  ]}
                ></Radio.Group>
                <Select
                  style={{ width: 100 }}
                  options={[
                    { key: 1, label: "분실", value: "분실" },
                    { key: 2, label: "고장", value: "고장" },
                    { key: 2, label: "수량부족", value: "수량부족" },
                  ]}
                />
              </div>
            ),
          };
          return newValue;
        }
      );
      setAssetAccessoryData([
        { key: 0, field: "품목", items: "수량" },
        ...accessoryData,
      ]);
    }
  }, [currentAssignment]);

  useEffect(() => {
    console.log(location);
    //assetAssignment당시 실수로 id값을 저장안해서 assetUID로 식별함

    if (location?.state?.data?.id) {
      fetchDocuments(location.state.data.assetUID);
    }
  }, [location]);

  return (
    <PageContainer
      isLoading={isLoading}
      pathname={location?.pathname}
      title={navigateMenus.find((f) => f.link === location.pathname).label}
      backKey={true}
    >
      <ConfigProvider
      // theme={{
      //   // token: { colorPrimary: "#93ffb7", colorPrimaryHover: "#c0ffd4" },
      //   token: {
      //     fontSize: 13,
      //     colorPrimary: "#f5f5f5",
      //     colorPrimaryHover: "#f5f5f5",
      //     colorBorder: "#f5f5f5",
      //     //fontSizeIcon: 0,
      //     colorBgContainer: "#f5f5f5",
      //   },
      //   components: {
      //     Select: {
      //       selectorBg: "#f5f5f5",
      //     },
      //     Input: {
      //       activeBg: "#f5f5f5",
      //       hoverBg: "#f5f5f5",
      //       addonBg: "#f5f5f5",
      //       activeShadow: "#f5f5f5",
      //     },
      //     Form: {
      //       labelFontSize: 13,
      //       labelColor: "#888888",
      //       itemMarginBottom: 5,
      //     },
      //     Button: {
      //       colorBorder: "#d9d9d9",
      //       colorPrimary: "#000",
      //       colorPrimaryHover: "#d9d9d",
      //     },
      //     Divider: {
      //       colorSplit: "#d8d8d8",
      //     },
      //     Switch: {
      //       colorPrimary: "#1677ff",
      //       colorPrimaryHover: "#4096ff",
      //       handleBg: "#fff",
      //     },
      //     Tabs: { colorPrimary: "#1677ff" },
      //     Table: { colorPrimary: "#fff" },
      //   },
      // }}
      >
        <Row
          gutter={media.isDesktopOrLaptop ? [24, 24] : [0, 10]}
          className="w-full"
        >
          <Col span={media.isDesktopOrLaptop ? 12 : 24}>
            <Card title="자산배정" size="small" className="bg-white">
              <Tabs className="w-full" items={tabItems} />
            </Card>
          </Col>
          <Col span={media.isDesktopOrLaptop ? 12 : 24}>
            <Form
              form={form}
              labelCol={{
                span: 4,
              }}
              colon={false}
              style={{
                width: "100%",
              }}
              labelAlign="left"
            >
              <Card
                title="자산반납 체크리스트"
                size="small"
                className="bg-white"
              >
                <Table
                  className="bg-white"
                  size="small"
                  columns={[
                    { key: 1, title: "항목", dataIndex: "field" },
                    { key: 2, title: "점검내용", dataIndex: "items" },
                    { key: 3, title: "비고", dataIndex: "action" },
                  ]}
                  dataSource={checkList}
                />
              </Card>
            </Form>
          </Col>
        </Row>
      </ConfigProvider>
      <Modal
        mask={false}
        maskClosable={false}
        keyboard={false}
        footer={null}
        open={modalProp.open}
        style={{
          minWidth: media.isMobile ? 400 : 1000,
          width: "100%",
          height: "100%",
          top: 10,
        }}
        onOk={() => setModalProp(() => ({ open: false, data: null }))}
        onCancel={() => setModalProp(() => ({ open: false, data: null }))}
      >
        <SelectItem />
      </Modal>
      {contextHolder}
    </PageContainer>
  );
};

export default AssetReturn;
