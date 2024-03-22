import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { navigateMenus } from "../navigate";
import PageBreadCrumb from "../utils/PageBreadCrumb";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Typography,
  notification,
} from "antd";
import {
  IsLoadingDiv,
  pageContentContainerTailWind,
  pageInlineStyle,
  pageTailWind,
} from "../layout/PageStyles";
import { CurrentLoginContext } from "../context/CurrentLogin";
import AssetInfoDetail from "../components/AssetInfoDetail";
import AssetUserAgreement from "../documents/AssetUserAgreement";
import PageContainer from "../layout/PageContainer";
import ProductInfoDetail from "../components/ProductInfoDetail";
import AddAssignment from "../components/AddAssignment";
import AssignmentProductCheck from "../components/AssignmentProductCheck";
import dayjs from "dayjs";
import ReactToPrint from "react-to-print";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import {
  useFirestoreAddData,
  useFirestoreQuery,
  useFirestoreUpdateData,
} from "../hooks/useFirestore";
import { Timestamp, where } from "firebase/firestore";
import { GenerateDocumentID } from "../utils/Index";
import { convertTimestampToDate, makeFeedObject } from "../functions";
import AddAssetPic from "../components/AddAssetPic";
const { Title, Text } = Typography;

const AssetAssignment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAssetInfo, setIsAssetInfo] = useState(false);
  const [documentInfo, setDocumentInfo] = useState({});
  const [assetInfo, setAssetInfo] = useState({});
  const [productInfo, setProductInfo] = useState({});
  const [assignmentDate, setAssignmentDate] = useState(dayjs());
  const [userInfo, setUserInfo] = useState({});
  const [IDLength, setIDLength] = useState(0);
  const [modalProp, setModalProp] = useState({ open: false, data: "" });
  const location = useLocation();
  const { media, memberSettings } = useContext(CurrentLoginContext);
  const printRef = useRef();
  const [form] = Form.useForm();
  const documentQuery = useFirestoreQuery();
  const addDocument = useFirestoreAddData();
  const updateAsset = useFirestoreUpdateData();
  const addFeed = useFirestoreAddData();

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
  // const breadCrumbItems = [
  //   {
  //     path: "/",
  //     breadcrumbName: "홈",
  //   },
  //   {
  //     path: navigateMenus.find
  //   }
  // ];
  const initFormValue = (value) => {
    form.setFieldsValue({
      assetAssignmentDate: dayjs(),
      docuType: "assetUserAgreement",
      docuActive: true,
      assetOwnerCompany: value.assetOwnerCompany,
      docuIssuerManager: "관리부 담당자",
    });
  };

  const reduceDocumentInfo = () => {
    const commonInfo = form.getFieldsValue();
    //console.log({ ...commonInfo, ...assetInfo, ...productInfo, ...userInfo });
    const unionInfo = {
      ...commonInfo,
      ...assetInfo,
      ...productInfo,
      ...userInfo,
    };
    const assetAssignmentDate = Timestamp.fromDate(
      commonInfo.assetAssignmentDate.toDate()
    );
    delete unionInfo.id;
    unionInfo.refAssetDocuID = assetInfo.id;
    const assetAssignmentDateConverted =
      convertTimestampToDate(assetAssignmentDate);
    unionInfo.assetAssignmentDate = assetAssignmentDate;
    unionInfo.assetReturnDate = unionInfo.isReturnDate
      ? Timestamp.fromDate(unionInfo.assetReturnDate.toDate())
      : "";
    unionInfo.assetReturnDateConverted = unionInfo.isReturnDate
      ? convertTimestampToDate(unionInfo.assetReturnDate)
      : "";
    unionInfo.assetAssignmentDateConverted = assetAssignmentDateConverted;
    //unionInfo.docuType = "assetUserAgreement";
    console.log(unionInfo);
    //setDocumentInfo(()=>({...unionInfo}))
    return unionInfo;
  };

  const handleAddAssignmentAddFeedAndUpdateAsset = async (
    originalData,
    reducedData
  ) => {
    const assetUpdateValue = {
      ...originalData,
      currentUser: reducedData?.currentUser,
      location: reducedData?.location,
      userInfo: reducedData?.userInfo,
      assetPics: [...reducedData?.assetPics] || [],
    };
    const feedCreatedAt = Timestamp.fromDate(new Date());
    const feedCreatedAtConverted = convertTimestampToDate(feedCreatedAt);

    const feedValue = makeFeedObject(
      originalData.id,
      originalData.assetCode,
      "system",
      feedCreatedAt,
      feedCreatedAtConverted,
      reducedData.assetAssignmentDate,
      reducedData.assetAssignmentDateConverted,
      "배정",
      `${reducedData.currentUser}에게 배정했습니다. ${reducedData.assignmentMemo}`,
      []
    );

    try {
      await addDocument.addData("assetDocuments", reducedData, () => {});
      //await addFeed.addData("assetFeeds", feedValue, () => {});
      await updateAsset.updateData(
        "assets",
        originalData.id,
        assetUpdateValue,
        () => {
          openNotification(
            "success",
            "배정완료",
            `자산을 배정했습니다.`,
            "topRight",
            3
          );
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDocumentsLength = async (ownerID, documentType, documentDate) => {
    const condidtions = [
      where("assetOwner", "==", ownerID),
      where("docuType", "==", documentType),
      where("assetAssignmentDateConverted", "==", documentDate),
    ];

    try {
      await documentQuery
        .getDocuments(
          "assetDocuments",
          (data) => {
            setIDLength(data.length);
          },
          condidtions
        )
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //console.log(location);
    if (location.pathname) {
      initFormValue(location.state.data);
      setIsLoading(false);
      setAssetInfo(location.state.data);
      const initProductInfo = {
        assetWorking: true,
        assetExterior: 5,
        assetAccessory: location.state.data?.assetAccessory,
      };
      setProductInfo(initProductInfo);
      const initUserInfo = {
        isReturnDate: false,
        assetReturnDate: "",
        location: location.state.data?.location,
        currentUser: location.state.data?.currentUser,
      };
      setUserInfo(initUserInfo);
    }
  }, [location]);

  useEffect(() => {
    const docuID = GenerateDocumentID({
      beforeString: "JNC",
      extraString: "ASSIGN",
      dateString: dayjs(assignmentDate).format("YYYYMMDD"),
      personalNumber: IDLength,
    });
    form.setFieldValue("docuID", docuID);
  }, [IDLength, assignmentDate]);

  useEffect(() => {
    if (memberSettings?.userID) {
      fetchDocumentsLength(
        memberSettings.userID,
        "assetUserAgreement",
        assignmentDate.format("YYYY-MM-DD")
      );
    }
  }, [memberSettings, assignmentDate]);

  return (
    <PageContainer
      isLoading={isLoading}
      pathname={location?.pathname}
      title={navigateMenus.find((f) => f.link === location.pathname).label}
      backKey={true}
    >
      <ConfigProvider
        theme={{
          // token: { colorPrimary: "#93ffb7", colorPrimaryHover: "#c0ffd4" },
          token: {
            fontSize: 13,
            colorPrimary: "#f5f5f5",
            colorPrimaryHover: "#f5f5f5",
            colorBorder: "#f5f5f5",
            //fontSizeIcon: 0,
            colorBgContainer: "#f5f5f5",
          },
          components: {
            Select: {
              selectorBg: "#f5f5f5",
            },
            Input: {
              activeBg: "#f5f5f5",
              hoverBg: "#f5f5f5",
              addonBg: "#f5f5f5",
              activeShadow: "#f5f5f5",
            },
            Form: {
              labelFontSize: 13,
              labelColor: "#888888",
              itemMarginBottom: 5,
            },
            Button: {
              colorBorder: "#d9d9d9",
              colorPrimary: "#000",
              colorPrimaryHover: "#d9d9d",
            },
            Divider: {
              colorSplit: "#d8d8d8",
            },
            Switch: {
              colorPrimary: "#1677ff",
            },
          },
        }}
      >
        <Row
          gutter={media.isDesktopOrLaptop ? [24, 24] : [0, 0]}
          className="w-full"
        >
          <Col span={media.isDesktopOrLaptop ? 12 : 24}>
            <Divider orientation="left" orientationMargin="0">
              <h1 className="font-semibold" style={{ fontSize: 13 }}>
                1. 기본정보
              </h1>
            </Divider>
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
              <Form.Item
                className="hidden"
                name="assetOwnerCompany"
              ></Form.Item>
              <Form.Item className="hidden" name="docuType"></Form.Item>
              <Form.Item className="hidden" name="docuActive"></Form.Item>
              <Form.Item name="assetAssignmentDate" label="작성일자">
                <DatePicker
                  allowClear={false}
                  locale={locale}
                  value={userInfo?.assetAssignmentDate}
                  onChange={(value) => setAssignmentDate(() => value)}
                />
              </Form.Item>
              <Form.Item name="docuID" label="문서번호">
                <Input />
              </Form.Item>
              <Form.Item name="docuIssuerManager" label="작성자">
                <Input />
              </Form.Item>
            </Form>
            <Divider orientation="left" orientationMargin="0">
              <div className="flex w-full justify-between items-center ">
                <h1 className="font-semibold" style={{ fontSize: 13 }}>
                  2. 자산정보
                </h1>
                <div className="flex ml-8" style={{ fontSize: 12 }}>
                  <button
                    type="button"
                    className="border rounded p-1 px-2"
                    onClick={() => setIsAssetInfo(!isAssetInfo)}
                  >
                    {isAssetInfo ? "숨기기" : "펼치기"}
                  </button>
                </div>
              </div>
            </Divider>
            {isAssetInfo && (
              <AssetInfoDetail
                data={location.state.data}
                info={assetInfo}
                setInfo={setAssetInfo}
              />
            )}

            <Divider orientation="left" orientationMargin="0">
              <h1 className="font-semibold" style={{ fontSize: 13 }}>
                3. 제품
              </h1>
            </Divider>
            <AssignmentProductCheck
              data={location.state.data}
              productInfo={productInfo}
              setProductInfo={setProductInfo}
            />
          </Col>
          <Col span={media.isDesktopOrLaptop ? 12 : 24}>
            <Divider orientation="left" orientationMargin="0">
              <h1 className="font-semibold" style={{ fontSize: 13 }}>
                4. 배정
              </h1>
            </Divider>
            <AddAssignment
              data={location.state.data}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
            />
            <Divider orientation="left" orientationMargin="0">
              <h1 className="font-semibold" style={{ fontSize: 13 }}>
                5. 사진업데이트(3장까지 허용)
              </h1>
            </Divider>
            <AddAssetPic
              data={location.state.data}
              assetInfo={assetInfo}
              setAssetInfo={setAssetInfo}
            />
            <Divider orientation="left" orientationMargin="0"></Divider>
            <div
              className="flex w-full justify-end items-center px-2 gap-x-3"
              style={{ height: 55 }}
            >
              <Button
                onClick={() =>
                  handleAddAssignmentAddFeedAndUpdateAsset(
                    location.state.data,
                    reduceDocumentInfo()
                  )
                }
                disabled={userInfo.currentUser === "미지정"}
              >
                동의서 없이 배정완료
              </Button>
              <Button
                onClick={() => {
                  setModalProp({ open: true, data: reduceDocumentInfo() });
                }}
              >
                동의서 미리보기
              </Button>
              {/* <ReactToPrint
            trigger={() => (
              <Button type="default" style={{ margin: "16px" }}>
                동의서 인쇄
              </Button>
            )}
            content={() => printRef.current}
          /> */}
            </div>
          </Col>
          {/* <Col span={media.isDesktopOrLaptop ? 12 : 24}>
        <Card size="small" classNames="w-full">
          <div ref={printRef} className="p-5">
            <AssetUserAgreement
              data={location.state.data}
              assetInfo={assetInfo}
              productInfo={productInfo}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
            />
          </div>
        </Card>
      </Col> */}
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
          <AssetUserAgreement data={modalProp.data} />
        </Modal>
        {contextHolder}
      </ConfigProvider>
    </PageContainer>
  );
};

export default AssetAssignment;
