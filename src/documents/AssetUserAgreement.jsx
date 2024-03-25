import React, { useContext, useEffect, useRef, useState } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import { initAssetUserAgreement } from "../InitValues";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Image,
  Input,
  QRCode,
  Row,
  Spin,
  Typography,
} from "antd";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import Title from "antd/es/typography/Title";
import { GenerateDocumentID } from "../utils/GenerateDocumentID";
import AssetUserAgreementPolicy from "./AssetUserAgreementPolicy";
import { SlPrinter } from "react-icons/sl";
import ReactToPrint from "react-to-print";
import "./print.css";
const today = new Date();
const borderColor = "bg-gray-600";
const defaultTemplate = {
  documentTitle: "자산 사용 동의서",
  documentDate: today,
};
const AssetUserAgreement = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentID, setDocumentID] = useState();
  const [documentTemplate, setDocumentTemplate] = useState({});
  const [IDLength, setIDLength] = useState(0);
  const { memberSettings } = useContext(CurrentLoginContext);
  const documentQuery = useFirestoreQuery();
  const [form] = Form.useForm();
  const printRef = useRef();

  const rowHeight = 30;

  const handleQRcode = (id) => {
    return (
      <div id="qrcode">
        <QRCode
          value={`https://jncore-asset.web.app/cc815a57-69fb-4e29-a6f6-e8e7cfe8de66/${id}`}
          bgColor="#fff"
          size={200}
          style={{ padding: 2 }}
        />
      </div>
    );
  };

  const fetchDocumentsLength = async (ownerID, documentType, documentDate) => {
    const condidtions = [
      where("ownerID", "==", ownerID),
      where("docuType", "==", documentType),
      where("assetAssignmentDate", "==", documentDate),
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
    const docuID = GenerateDocumentID({
      beforeString: "JNC",
      extraString: "ASSIGN",
      dateString: dayjs(data?.assetAssignmentDate).format("YYYYMMDD"),
      personalNumber: IDLength,
    });
    form.setFieldValue("docuID", docuID);
  }, [IDLength, data?.assetAssignmentDate]);

  useEffect(() => {
    if (memberSettings?.assetUserAgreement) {
      setDocumentTemplate({ ...memberSettings.assetUserAgreement });
    } else {
      setDocumentTemplate(() => ({ ...initAssetUserAgreement }));
      //console.log(initAssetUserAgreement);
    }

    if (memberSettings?.userID) {
      fetchDocumentsLength(
        memberSettings.userID,
        "assetUserAgreement",
        data?.assetAssignmentDateConverted
      );
    }
  }, [memberSettings, data?.assetAssignmentDateConverted]);

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <>
      {isLoading && (
        <div className="w-full h-screen justify-center items-center flex">
          <Spin />
        </div>
      )}
      {!isLoading && (
        <div className="flex w-full h-full flex-col justify-start items-start">
          <div
            className="flex w-full justify-end items-center px-4 mt-4"
            style={{ height: 50 }}
          >
            <ReactToPrint
              trigger={() => (
                <Button type="primary" className="bg-blue-500" size="large">
                  인쇄
                </Button>
              )}
              content={() => printRef.current}
            />
          </div>
          <div
            ref={printRef}
            className="flex w-full h-full p-2 flex-col "
            style={{ fontFamily: "맑은 고딕, 돋움, 굴림" }}
          >
            <Form form={form} style={{ width: "100%" }}>
              <div className="flex w-full h-full justify-start items-center flex-col gap-y-2 ">
                <div
                  className="flex w-full border border-gray-700 justify-center items-center"
                  style={{ height: 40 }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                    }}
                  >
                    자산 사용 동의서
                  </span>
                </div>
                <div
                  className="flex w-full flex-col border border-gray-400 justify-center items-center"
                  style={{ height: "auto", fontSize: 13 }}
                >
                  <div className="flex w-full h-full justify-start items-center border-b border-b-gray-300">
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      작성일자
                    </div>
                    <div className="flex w-full  px-3">
                      {data?.assetAssignmentDateConverted}
                    </div>
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      문서번호
                    </div>
                    <div className="flex w-full px-3">{data?.docuID}</div>
                  </div>
                  <div className="flex w-full h-full justify-start items-center">
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      회사명
                    </div>
                    <div className="flex w-full  px-3">
                      {data?.assetOwnerCompany}
                    </div>
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      담당자
                    </div>
                    <div className="flex w-full px-3">
                      {data?.docuIssuerManager}
                    </div>
                  </div>
                </div>

                <div className="flex w-full justify-start items-center">
                  자산정보 :
                </div>
                <div
                  className="flex w-full flex-col border border-gray-400 justify-center items-center"
                  style={{ height: "auto", fontSize: 13 }}
                >
                  <div className="flex w-full h-full justify-start items-center border-b border-b-gray-300">
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      분류
                    </div>
                    <div className="flex px-3" style={{ width: "95%" }}>
                      {data?.assetCategory}
                    </div>
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      품목
                    </div>
                    <div className="flex px-3" style={{ width: "95%" }}>
                      {data?.assetProductLine}
                    </div>
                  </div>
                  <div className="flex w-full h-full justify-start items-center border-b border-b-gray-300">
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      자산명
                    </div>
                    <div className="flex px-3" style={{ width: "95%" }}>
                      {data?.assetName}
                    </div>
                  </div>
                  <div className="flex w-full h-full justify-start items-center border-b border-b-gray-300">
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      자산코드
                    </div>
                    <div className="flex px-3" style={{ width: "95%" }}>
                      <span>{data?.assetCode}</span>
                    </div>
                  </div>
                  <div className="flex w-full h-full justify-start items-center border-b border-b-gray-300">
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      제품상태
                    </div>
                    <div className="flex px-3 gap-x-5" style={{ width: "95%" }}>
                      <span className="">
                        작동상태:
                        <span>
                          {data?.assetWorking === true ? "정상" : "불능"}
                        </span>
                      </span>

                      <span>
                        외관: <span>{data?.assetExterior}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full bg-gray-200 h-full justify-start items-center ">
                    <div
                      className="flex px-3 justify-start items-center"
                      style={{
                        minWidth: "100px",
                        height: "100%",
                      }}
                    >
                      <span>구성품</span>
                    </div>
                    <div className="flex h-full bg-white w-full px-3 py-2 justify-center items-start">
                      <div
                        className="flex h-full flex-col border rounded"
                        style={{ width: "95%" }}
                      >
                        <div className="flex w-full bg-gray-100 p-1 font-semibold  border-b">
                          <div
                            className="flex justify-center items-center"
                            style={{ width: "10%" }}
                          ></div>
                          <div
                            className="flex justify-center items-center"
                            style={{ width: "70%" }}
                          >
                            품목
                          </div>
                          <div
                            className="flex justify-center items-center"
                            style={{ width: "20%" }}
                          >
                            수량
                          </div>
                        </div>
                        {data?.assetAccessory?.length > 0 &&
                          data.assetAccessory.map((accessory, idx) => {
                            const { index, name, count } = accessory;
                            return (
                              <div className="flex w-full bg-white p-1">
                                <div
                                  className="flex justify-center items-center"
                                  style={{ width: "10%" }}
                                >
                                  {index}
                                </div>
                                <div
                                  className="flex justify-start items-center"
                                  style={{ width: "70%" }}
                                >
                                  <span className="ml-2 ">{name}</span>
                                </div>
                                <div
                                  className="flex justify-center items-center"
                                  style={{ width: "20%" }}
                                >
                                  {count}
                                </div>
                              </div>
                            );
                          })}
                        {data?.assetAccessory?.length === 0 && (
                          <div className="flex w-full bg-white p-1 justify-center items-center">
                            <Empty description="구성품이 없습니다." />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-start items-center">
                  인적사항 :
                </div>
                <div
                  className="flex w-full flex-col border border-gray-400 justify-center items-center"
                  style={{ height: "auto", fontSize: 13 }}
                >
                  <div className="flex w-full h-full justify-start items-center border-b border-b-gray-300">
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      부서명
                    </div>
                    <div className="flex px-3" style={{ width: "95%" }}>
                      {data?.userInfo?.userDepartment}
                    </div>
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      직위
                    </div>
                    <div className="flex px-3" style={{ width: "95%" }}>
                      {data?.userInfo?.userSpot}
                    </div>
                  </div>
                  <div className="flex w-full h-full justify-start items-center ">
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      직급
                    </div>
                    <div className="flex px-3" style={{ width: "95%" }}>
                      {data?.userInfo?.userRank}
                    </div>
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                      }}
                    >
                      이름
                    </div>
                    <div className="flex px-3" style={{ width: "95%" }}>
                      {data?.userInfo?.userName}
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-start items-center">
                  사용기간 :
                </div>
                <div
                  className="flex w-full flex-col border border-gray-400 justify-center items-center"
                  style={{ height: "auto", fontSize: 13 }}
                >
                  <div className="flex w-full h-full justify-start items-center ">
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      시작일자
                    </div>
                    <div className="flex px-3" style={{ width: "95%" }}>
                      {data?.assetAssignmentDateConverted}
                    </div>
                    <div
                      className="flex h-full bg-gray-200 px-3 justify-start items-center"
                      style={{
                        width: "100px",
                        minWidth: "100px",
                        maxWidth: "100px",
                        height: rowHeight,
                      }}
                    >
                      반납일자
                    </div>
                    <div className="flex px-3" style={{ width: "95%" }}>
                      {data?.assetReturnDateConverted}
                    </div>
                  </div>
                </div>

                <div
                  className="flex w-full flex-col border border-gray-400 justify-center items-center"
                  style={{ height: "auto", fontSize: 13 }}
                >
                  <div className="flex w-full h-full justify-start items-center ">
                    <div className="flex w-full bg-white px-3">
                      <AssetUserAgreementPolicy />
                    </div>
                  </div>
                </div>
                <div
                  className="flex w-full border border-gray-400 justify-center items-center"
                  style={{ height: "auto", fontSize: 13 }}
                >
                  <div
                    className="flex h-full bg-gray-200 px-3 justify-start items-center"
                    style={{
                      width: "100px",
                      minWidth: "100px",
                      maxWidth: "100px",
                      height: 50,
                    }}
                  >
                    서명
                  </div>
                  <div className="flex px-3" style={{ width: "95%" }}></div>
                </div>
              </div>
            </Form>

            <div
              className="a4-size flex flex-col print-page-break"
              style={{
                fontFamily: "맑은 고딕, 돋움, 굴림",
              }}
            >
              <Row className="w-full">
                <Col span={24}>
                  <Card title="현재사진" size="small" className="w-full">
                    <div className="flex gap-2  justify-center items-start">
                      {data.assetPics?.length > 0 &&
                        data.assetPics.map((item, idx) => {
                          const { url } = item;
                          return <Image src={url} width={250} height={250} />;
                        })}
                    </div>
                  </Card>
                </Col>
                <Col span={24}></Col>
              </Row>
            </div>

            <div
              className="a4-size flex flex-col print-page-break"
              style={{
                fontFamily: "맑은 고딕, 돋움, 굴림",
              }}
            >
              <Row className="w-full">
                <Col span={24}>
                  <Card title="QR코드" size="small" className="w-full">
                    <div className="flex gap-2 w-full h-full justify-center items-start">
                      {handleQRcode(data?.refAssetDocuID)}
                    </div>
                  </Card>
                </Col>
                <Col span={24}></Col>
              </Row>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetUserAgreement;
