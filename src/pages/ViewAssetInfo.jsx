import {
  Badge,
  Card,
  Col,
  Dropdown,
  Image,
  Menu,
  Modal,
  QRCode,
  Row,
  Space,
  Spin,
  Tabs,
  notification,
} from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  EditOutlined,
  FolderAddOutlined,
  EllipsisOutlined,
  MoreOutlined,
} from "@ant-design/icons";

import {
  ConvertTimestampToDateByArray,
  FilterKeyByArray,
  setColumnItem,
  setMenuItem,
  setSections,
} from "../utils/Index";

import { useLocation, useNavigate } from "react-router-dom";
import {
  useFirestoreGetDocument,
  useFirestoreQuery,
} from "../hooks/useFirestore";
import AssetInfoDetail from "../components/AssetInfoDetail";
import { CurrentLoginContext } from "../context/CurrentLogin";
import AssetTimeLine from "../components/AssetTimeLine";
import PageContainer from "../layout/PageContainer";
import { navigateMenus } from "../navigate";
import { MdSend } from "react-icons/md";
import { FaRegTrashAlt, FaUserTag } from "react-icons/fa";
import { IoReturnUpBack } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { SlPrinter } from "react-icons/sl";
import { GrDocumentText } from "react-icons/gr";
import AssetFeedAdd from "../components/AssetFeedAdd";
import { where } from "firebase/firestore";
import AssetUserAgreement from "../documents/AssetUserAgreement";

const ViewAssetInfo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assetPics, setAssetPics] = useState([]);
  const [currentAssetPic, setCurrentAssetPic] = useState();
  const [docuList, setDocuList] = useState([]);
  const [lastActiveDocument, setLastActiveDocument] = useState({});
  const assetGet = useFirestoreGetDocument();
  const navigate = useNavigate();
  const [modalFeed, setModalFeed] = useState({ open: false, data: null });
  const [modalProp, setModalProp] = useState({ open: false, data: null });
  const [modalReturn, setModalReturn] = useState({
    open: false,
    data: "",
  });
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
  const { media } = useContext(CurrentLoginContext);
  const docuQuery = useFirestoreQuery();

  const location = useLocation();
  const tabItems = [
    {
      key: 1,
      label: "상세정보",
      children: <AssetInfoDetail data={location.state.data} />,
    },
    {
      key: 2,
      label: "타임라인",
      children: <AssetTimeLine assetDocuID={location.state.data.id} />,
    },
  ];
  const renderQRCode = () => {
    const canvas = document.getElementById("qrcode")?.querySelector("canvas");
    if (canvas) {
      // 새 캔버스 생성
      const newCanvas = document.createElement("canvas");
      const context = newCanvas.getContext("2d");

      // 여백 설정 (예: 20px)
      const padding = 20;
      // 새 캔버스의 크기를 원본 QR 코드 캔버스 크기 + 여백으로 설정
      newCanvas.width = canvas.width + padding * 2;
      newCanvas.height = canvas.height + padding * 2;

      // 배경을 흰색으로 설정
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, newCanvas.width, newCanvas.height);

      // 원본 QR 코드 이미지를 새 캔버스에 그리기 (여백을 고려하여 위치 조정)
      context.drawImage(canvas, padding, padding);
      const url = newCanvas.toDataURL();
      return url;
    }
  };

  const handlePicUrlArray = () => {};

  const handleQRcode = (id) => {
    return (
      <div id="qrcode">
        <QRCode
          value={`https://jncore-asset.web.app/cc815a57-69fb-4e29-a6f6-e8e7cfe8de66/${id}`}
          bgColor="#fff"
          size={700}
          style={{ padding: 2 }}
        />
      </div>
    );
  };

  const drawMenu = (record) => {
    return (
      <Menu
        items={[
          setMenuItem(
            false,
            "이력남기기",
            <MdSend className="text-base" />,
            3,
            (value) => {
              setModalFeed({ open: true, data: record });
            },
            record
          ),
          record?.userInfo?.userName === "미지정"
            ? setMenuItem(
                false,
                "자산배정",
                <FaUserTag className="text-base" />,
                5,
                () => {
                  //setModalAssign({ open: true, data: record });
                  navigate(
                    navigateMenus.find((f) => f.label === "자산배정").link,
                    { state: { data: record } }
                  );
                },
                record
              )
            : setMenuItem(
                false,
                "자산반납",
                <IoReturnUpBack className="text-base" />,
                5,
                () => {
                  navigate(
                    navigateMenus.find((f) => f.label === "자산반납").link,
                    { state: { data: record } }
                  );
                },
                record
              ),
          setMenuItem(
            record?.userInfo?.userName === "미지정" ? true : false,
            "사용동의서보기",
            <GrDocumentText className="text-base" />,
            6,
            () => {
              setModalProp({ open: true, data: lastActiveDocument });
            },
            record
          ),
          setMenuItem(
            false,
            "자산수정",
            <CiEdit className="text-base" />,
            7,
            () => {
              //setModalAssign({ open: true, data: record });
              navigate(navigateMenus.find((f) => f.label === "자산수정").link, {
                state: { data: record },
              });
            },
            record
          ),
          setMenuItem(
            false,
            "자산코드인쇄",
            <SlPrinter className="text-base" />,
            9,
            () => {
              navigate(navigateMenus.find((f) => f.label === "자산인쇄").link, {
                state: { data: [record] },
              });
            },
            record
          ),
          setMenuItem(
            false,
            "삭제",
            <FaRegTrashAlt className="text-base" />,
            11,
            (value) => {
              console.log(value);
            },
            record
          ),
        ]}
      />
    );
  };

  const fetchDocuments = async (ownerID, assetUID) => {
    const condition = [
      where("assetOwner", "==", ownerID),
      where("assetUID", "==", assetUID),
    ];

    try {
      await docuQuery
        .getDocuments(
          "assetDocuments",
          (data) => {
            setDocuList(() => [...data]);
          },
          condition
        )
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };
  const assetInfo = useMemo(() => {
    if (location?.state) {
      setIsLoading(false);
      return location.state.data;
    } else {
      setIsLoading(false);
      return null;
    }
  }, [location]);

  useEffect(() => {
    if (!assetInfo?.id) {
      setAssetPics([]);
      return;
    }

    const picUrls =
      assetInfo.firstPics?.length > 0
        ? assetInfo.firstPics.map((pic) => pic.url)
        : [];
    const QRUrl = renderQRCode(assetInfo.id); // QRUrl을 배열로 처리

    const newAssetPicsURL = [...picUrls, QRUrl];
    setAssetPics(newAssetPicsURL); // 계산된 URL 배열을 상태에 저장

    setCurrentAssetPic(picUrls.length > 0 ? picUrls[0] : QRUrl);
    fetchDocuments(assetInfo.assetOwner, assetInfo.assetUID);
  }, [assetInfo]); // assetInfo가 변경될 때마다 실행

  useEffect(() => {
    console.log(docuList);
    const findLastDocument = docuList.find((f) => f.docuActive === true);
    setLastActiveDocument(() => ({ ...findLastDocument }));
  }, [docuList]);

  return (
    <>
      {isLoading && (
        <div className="w-full h-screen flex justify-center items-center">
          <Spin />
        </div>
      )}
      {!isLoading && (
        <PageContainer
          isLoading={isLoading}
          pathname={location?.pathname}
          title={navigateMenus.find((f) => f.link === location.pathname).label}
          gutter={[16, 16]}
          backKey={true}
        >
          <Row
            gutter={media.isDesktopOrLaptop ? [24, 24] : [0, 0]}
            className="w-full"
          >
            <Col span={media.isMobile ? 24 : 8}>
              <Card className="flex flex-col justify-start items-center">
                <Image.PreviewGroup items={[...assetPics]}>
                  <Image
                    width={media.isMobile ? 160 : 250}
                    src={currentAssetPic}
                    fallback="data:image/png;base64,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"
                    preview={true}
                  />
                </Image.PreviewGroup>
              </Card>

              <div
                className={
                  media.isMobile ? "flex gap-1 my-2" : "flex gap-1 mt-2"
                }
              >
                {assetPics.length > 0 &&
                  assetPics.map((url, uIdx) => (
                    <>
                      <Image
                        src={url}
                        width={media.isMobile ? 35 : 85}
                        height={media.isMobile ? 35 : 85}
                        preview={false}
                        key={uIdx}
                        className=" rounded-lg cursor-pointer"
                        style={{ border: "1px solid #dfdfdf", padding: 2 }}
                        onClick={() => setCurrentAssetPic(() => url)}
                      />
                    </>
                  ))}
                <div className=" hidden">
                  {handleQRcode(assetInfo.id, assetInfo.assetCode)}
                </div>
              </div>
            </Col>
            <Col span={media.isMobile ? 24 : 16}>
              <div
                className={
                  media.isMobile
                    ? "flex w-full justify-center items-start flex-col px-0 "
                    : "flex w-full justify-center items-start flex-col px-5 "
                }
              >
                <Space className="w-full" direction="vertical">
                  <Badge.Ribbon
                    text={assetInfo.assetPurchasedType}
                    className="-mt-5"
                  >
                    <Card
                      style={{ width: "100%" }}
                      size="large"
                      title={
                        <h1
                          style={{
                            fontSize: media.isMobile ? 20 : 24,
                            fontWeight: 600,
                            fontFamily: "Nanum Gothic",
                          }}
                        >
                          {assetInfo.assetName}
                        </h1>
                      }
                      extra={
                        <Dropdown
                          overlay={drawMenu(location?.state?.data)}
                          trigger={["hover"]}
                        >
                          <button>
                            <MoreOutlined
                              style={{ fontSize: 20, fontWeight: 600 }}
                            />
                          </button>
                        </Dropdown>
                      }
                    >
                      <p className="text-gray-400" style={{ fontSize: 14 }}>
                        <Space
                          direction={
                            media.isTablet || media.isMobile
                              ? "vertical"
                              : "horizontal"
                          }
                        >
                          <Space>
                            <span>취득방식:{assetInfo.assetPurchasedType}</span>{" "}
                            |<span>제조사:{assetInfo.assetVendor}</span> |
                            <span>분류:{assetInfo.assetCategory}</span> |
                          </Space>
                          <Space>
                            <span>품목:{assetInfo.assetProductLine}</span> |
                            <span>
                              구매일자:{assetInfo.assetPurchasedDateConverted}
                            </span>
                            |
                          </Space>
                        </Space>
                      </p>
                    </Card>
                  </Badge.Ribbon>
                  <Card size="small" className="w-full mt-2">
                    {assetInfo.assetDescritionSummay}
                  </Card>
                  <Card size="small" className="w-full mt-2">
                    <Tabs items={tabItems} className="mt-2 w-full" />
                  </Card>
                </Space>
              </div>
            </Col>
          </Row>

          <Modal
            mask={false}
            maskClosable={false}
            keyboard={false}
            width={500}
            title="이력 남기기"
            footer={null}
            open={modalFeed.open}
            onOk={() => setModalFeed(() => ({ open: false, data: null }))}
            onCancel={() => setModalFeed(() => ({ open: false, data: null }))}
          >
            <AssetFeedAdd data={modalFeed.data} setClose={setModalFeed} />
          </Modal>
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
        </PageContainer>
      )}
    </>
  );
};

export default ViewAssetInfo;
