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
import { SlPrinter } from "react-icons/sl";
import ReactToPrint from "react-to-print";

const today = new Date();
const borderColor = "bg-gray-600";
const defaultTemplate = {
  documentTitle: "자산 사용 동의서",
  documentDate: today,
};
const AssetAgreementView = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const rowHeight = 30;

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
          <div className="flex w-full h-full justify-start items-center flex-col gap-y-2 ">
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
                    <span>{data?.assetWorking === true ? "정상" : "불능"}</span>
                  </span>

                  <span>
                    외관: <span>{data?.assetExterior}</span>
                  </span>
                </div>
              </div>
              <div className="flex w-full h-full justify-start items-center bg-gray-200">
                <div
                  className="flex h-auto bg-gray-200 px-3 justify-start items-center"
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
                  className="flex bg-white h-full px-3 py-2 justify-center items-start"
                  style={{ width: "100%" }}
                >
                  <div
                    className="flex h-auto flex-col border rounded"
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
                    height: rowHeight,
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
          </div>
        </div>
      )}
    </>
  );
};

export default AssetAgreementView;
