import {
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Radio,
  Rate,
  Row,
  Select,
  Space,
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
import TextArea from "antd/es/input/TextArea";

const AssetReturn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAssetAccessory, setIsAssetAccessory] = useState(true);
  const [isAssetAfterAction, setIsAssetAfterAction] = useState(false);
  const [assetAccessoryList, setAssetAccessoryList] = useState([]);
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

  const handleReduceAssetAccessory = (index = 100000, list, value) => {
    const newList = [...list];
    let updatedList = [];
    if (list?.length === 0) {
      return;
    }
    if (index === 100000) {
      updatedList = newList.map((item) => {
        return {
          ...item,
          status: "정상",
        };
      });
    } else {
      const newValue = { ...list[index], status: value };
      newList.splice(index, 1, newValue);
      updatedList = [...newList];
    }

    return updatedList;
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

  useEffect(() => {
    if (currentAssignment?.id) {
      form.setFieldsValue({
        assetExterior: currentAssignment?.assetExterior,
        assetWorking: currentAssignment?.assetWorking,
      });
      const newAssetAccessory = handleReduceAssetAccessory(
        100000,
        currentAssignment?.assetAccessory
      );
      setAssetAccessoryList(() => [...newAssetAccessory]);
    }
  }, [currentAssignment]);

  useEffect(() => {
    //console.log(location);
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
              span: 5,
            }}
            colon={false}
            style={{
              width: "100%",
            }}
            labelAlign="left"
          >
            <Card
              title={
                <div className="flex w-full justify-start items-center gap-x-4">
                  <span className="font-semibold">반납 체크리스트</span>
                  <div className="flex h-full justify-start items-center gap-x-2">
                    <span className="text-xs font-normal">자산정보 동기화</span>
                    <Switch size="small" />
                  </div>
                </div>
              }
              size="small"
              className="bg-white"
            >
              <ConfigProvider theme={{ token: { colorBgContainer: "#fff" } }}>
                <Form.Item
                  name="assetExterior"
                  label={<span className="font-semibold">1. 외관</span>}
                >
                  <Rate allowClear allowHalf />
                </Form.Item>
                <Form.Item
                  name="assetWorking"
                  label={<span className="font-semibold">2. 작동여부</span>}
                >
                  <Radio.Group
                    options={[
                      { key: 1, label: "정상", value: true },
                      { key: 2, label: "비정상", value: false },
                    ]}
                  ></Radio.Group>
                </Form.Item>
                <Form.Item
                  label={<span className="font-semibold">3. 구성품확인</span>}
                >
                  <Radio.Group
                    value={isAssetAccessory}
                    onChange={(e) => setIsAssetAccessory(e.target.value)}
                    options={[
                      { key: 1, label: "정상", value: true },
                      { key: 2, label: "비정상", value: false },
                    ]}
                  ></Radio.Group>
                </Form.Item>
                {!isAssetAccessory && (
                  <List
                    bordered
                    className="mb-2"
                    header={
                      <div className="flex w-full justify-start gap-x-4">
                        <span className="font-semibold">구성품</span>
                      </div>
                    }
                    size="small"
                    dataSource={assetAccessoryList}
                    renderItem={(item, idx) => {
                      return (
                        <List.Item
                          actions={[
                            <Select
                              value={assetAccessoryList[idx]?.status}
                              onChange={(value) =>
                                setAssetAccessoryList(() => [
                                  ...handleReduceAssetAccessory(
                                    idx,
                                    assetAccessoryList,
                                    value
                                  ),
                                ])
                              }
                              style={{ width: 100 }}
                              options={[
                                { key: 0, label: "정상", value: "정상" },
                                { key: 1, label: "분실", value: "분실" },
                                { key: 2, label: "고장", value: "고장" },
                                {
                                  key: 3,
                                  label: "수량부족",
                                  value: "수량부족",
                                },
                              ]}
                            />,
                          ]}
                        >
                          <div className="flex gap-x-2">
                            <span>{idx + 1}.</span>
                            <div className="flex gap-x-4">
                              <span>품목 : {item?.name}</span>
                              <span>수량 : {item?.count}</span>
                            </div>
                          </div>
                        </List.Item>
                      );
                    }}
                  />
                )}

                <Form.Item
                  label={<span className="font-semibold">4. 후속조치</span>}
                >
                  <Space direction="vertical" className="w-full h-full">
                    <Form.Item noStyle>
                      <Radio.Group
                        value={isAssetAfterAction}
                        onChange={(e) => {
                          setIsAssetAfterAction(e.target.value);
                        }}
                        options={[
                          { key: 1, label: "없음", value: false },
                          { key: 2, label: "필요", value: true },
                        ]}
                      ></Radio.Group>
                    </Form.Item>
                    {isAssetAfterAction && (
                      <Form.Item noStyle name="assetAfterActionMemo">
                        <TextArea rows={3} style={{ resize: "none" }} />
                      </Form.Item>
                    )}
                  </Space>
                </Form.Item>
                <Divider />
                <div className="flex w-full h-full gap-x-2 justify-end">
                  <Button type="primary" size="large" className="bg-blue-500">
                    반납완료
                  </Button>
                  <Button type="default" size="large">
                    확인서보기
                  </Button>
                </div>

                {/* <Table
                  size="small"
                  columns={[
                    { key: 1, title: "항목", dataIndex: "field" },
                    { key: 2, title: "점검내용", dataIndex: "items" },
                    { key: 3, title: "비고", dataIndex: "action" },
                  ]}
                  dataSource={checkList}
                /> */}
              </ConfigProvider>
            </Card>
          </Form>
        </Col>
      </Row>

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
