import React, { useContext, useEffect, useState } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import { initAssetUserAgreement } from "../InitValues";
import { DatePicker, Empty, Form, Input, Spin, Typography } from "antd";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import Title from "antd/es/typography/Title";
import { GenerateDocumentID } from "../utils/GenerateDocumentID";
import AssetUserAgreementPolicy from "./AssetUserAgreementPolicy";
const today = new Date();
const borderColor = "bg-gray-600";
const defaultTemplate = {
  documentTitle: "자산 사용 동의서",
  documentDate: today,
};
const AssetUserAgreement = ({
  data,
  assetInfo,
  productInfo,
  userInfo,
  setAssetInfo,
  setProductInfo,
  setUserInfo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentID, setDocumentID] = useState();
  const [documentTemplate, setDocumentTemplate] = useState({});
  const [IDLength, setIDLength] = useState(0);
  const { memberSettings } = useContext(CurrentLoginContext);
  const documentQuery = useFirestoreQuery();
  const [form] = Form.useForm();

  const rowHeight = 30;
  const initFormValue = (value) => {
    form.setFieldsValue({
      docuType: "assetUserAgreement",
      ownerID: value.id,
      docuIssuerCompany: value.assetOwnerCompany,
      docuIssuerManager: "관리부 담당자",
    });
  };
  const fetchDocumentsLength = async (ownerID, documentType, documentDate) => {
    const condidtions = [
      where("ownerID", "==", ownerID),
      where("docuType", "==", documentType),
      where("docuDateConverted", "==", documentDate),
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
      dateString: dayjs(userInfo?.assetAssignmentDate).format("YYYYMMDD"),
      personalNumber: IDLength,
    });
    form.setFieldValue("docuID", docuID);
  }, [IDLength, userInfo?.assetAssignmentDate]);

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
        userInfo?.assetAssignmentDate.format("YYYY-MM-DD")
      );
    }
  }, [memberSettings, userInfo?.assetAssignmentDate]);

  useEffect(() => {
    if (data) {
      initFormValue(data);
    }
    console.log(data);
  }, [data]);

  return (
    <>
      {isLoading && (
        <div className="w-full h-screen justify-center items-center flex">
          <Spin />
        </div>
      )}
      {!isLoading && (
        <div
          className="flex w-full h-full p-2"
          style={{ fontFamily: "맑은 고딕, 돋움, 굴림" }}
        >
          <Form form={form} style={{ width: "100%" }}>
            <div className="flex w-full h-full justify-start items-center flex-col gap-y-2">
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
                    <DatePicker
                      allowClear={false}
                      size="small"
                      locale={locale}
                      value={userInfo?.assetAssignmentDate}
                      onChange={(value) =>
                        setUserInfo(() => ({
                          ...userInfo,
                          assetAssignmentDate: value,
                        }))
                      }
                    />
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
                  <div className="flex w-full px-3">
                    <Form.Item name="docuID" noStyle>
                      <Input size="small" />
                    </Form.Item>
                  </div>
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
                    <Form.Item name="docuIssuerCompany" noStyle>
                      <Input size="small" />
                    </Form.Item>
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
                    <Form.Item name="docuIssuerManager" noStyle>
                      <Input size="small" />
                    </Form.Item>
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
                    {assetInfo?.assetCategory}
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
                    {assetInfo?.assetProductLine}
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
                    {assetInfo?.assetName}
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
                    <span>{assetInfo?.assetCode}</span>
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
                        {productInfo?.assetWorking === true ? "정상" : "불능"}
                      </span>
                    </span>

                    <span>
                      외관: <span>{productInfo?.assetExterior}</span>
                    </span>
                  </div>
                </div>
                <div className="flex w-full h-full justify-start items-center ">
                  <div
                    className="flex h-full bg-gray-200 px-3 justify-start items-center"
                    style={{
                      width: "100px",
                      minWidth: "100px",
                      maxWidth: "100px",
                      height: "100%",
                    }}
                  >
                    구성품
                  </div>
                  <div
                    className="flex px-3 py-2 justify-center items-start"
                    style={{ width: "100%" }}
                  >
                    <div
                      className="flex bg-red-200 h-auto flex-col border rounded"
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
                      {productInfo?.assetAccessory?.length > 0 &&
                        productInfo.assetAccessory.map((accessory, idx) => {
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
                      {productInfo?.assetAccessory?.length === 0 && (
                        <div className="flex w-full bg-white p-1 justify-center items-center">
                          test <Empty description="구성품이 없습니다." />
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
                    {userInfo?.userInfo?.userDepartment}
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
                    {userInfo?.userInfo?.userSpot}
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
                    {userInfo?.userInfo?.userRank}
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
                    {userInfo?.userInfo?.userName}
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
                    {userInfo?.assetAssignmentDate &&
                      dayjs(userInfo.assetAssignmentDate).format("YYYY-MM-DD")}
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
                    {userInfo?.isReturnDate
                      ? dayjs(userInfo?.assetReturnDate).format(
                          "YYYY-MM-DD"
                        ) === "Invalid Date"
                        ? ""
                        : dayjs(userInfo?.assetReturnDate).format("YYYY-MM-DD")
                      : "미지정"}
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
        </div>
      )}
    </>
  );
};

export default AssetUserAgreement;
