import React, { useContext, useEffect, useState } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import { initAssetUserAgreement } from "../InitValues";
import { DatePicker, Form, Input, Spin, Typography } from "antd";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import Title from "antd/es/typography/Title";
import { GenerateDocumentID } from "../utils/GenerateDocumentID";
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
      personalNumber: IDLength,
    });
    form.setFieldValue("docuID", docuID);
  }, [IDLength]);

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
        dayjs().format("YYYY-MM-DD")
      );
    }
  }, [memberSettings]);

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
                style={{ height: 45 }}
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
                      height: 35,
                    }}
                  >
                    작성일자
                  </div>
                  <div className="flex w-full bg-white px-3">
                    <DatePicker
                      size="small"
                      locale={locale}
                      defaultValue={dayjs(new Date())}
                    />
                  </div>
                  <div
                    className="flex h-full bg-gray-200 px-3 justify-start items-center"
                    style={{
                      width: "100px",
                      minWidth: "100px",
                      maxWidth: "100px",
                      height: 35,
                    }}
                  >
                    문서번호
                  </div>
                  <div className="flex w-full bg-white px-3">
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
                      height: 35,
                    }}
                  >
                    회사명
                  </div>
                  <div className="flex w-full bg-white px-3">
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
                      height: 35,
                    }}
                  >
                    담당자
                  </div>
                  <div className="flex w-full bg-white px-3">
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
                      height: 35,
                    }}
                  >
                    분류
                  </div>
                  <div className="flex w-full bg-white px-3">
                    <Form.Item name="assetCategory" noStyle>
                      <Input size="small" />
                    </Form.Item>
                  </div>
                  <div
                    className="flex h-full bg-gray-200 px-3 justify-start items-center"
                    style={{
                      width: "100px",
                      minWidth: "100px",
                      maxWidth: "100px",
                      height: 35,
                    }}
                  >
                    품목
                  </div>
                  <div className="flex w-full bg-white px-3">
                    <Form.Item name="assetProductLine" noStyle>
                      <Input size="small" />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex w-full h-full justify-start items-center border-b border-b-gray-300">
                  <div
                    className="flex h-full bg-gray-200 px-3 justify-start items-center"
                    style={{
                      width: "100px",
                      minWidth: "100px",
                      maxWidth: "100px",
                      height: 35,
                    }}
                  >
                    자산명
                  </div>
                  <div className="flex w-full bg-white px-3">
                    <Form.Item name="assetName" noStyle>
                      <Input size="small" />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex w-full h-full justify-start items-center border-b border-b-gray-300">
                  <div
                    className="flex h-full bg-gray-200 px-3 justify-start items-center"
                    style={{
                      width: "100px",
                      minWidth: "100px",
                      maxWidth: "100px",
                      height: 35,
                    }}
                  >
                    자산코드
                  </div>
                  <div className="flex w-full bg-white px-3">
                    <Form.Item name="assetName" noStyle>
                      <Input size="small" />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex w-full h-full justify-start items-center border-b border-b-gray-300">
                  <div
                    className="flex h-full bg-gray-200 px-3 justify-start items-center"
                    style={{
                      width: "100px",
                      minWidth: "100px",
                      maxWidth: "100px",
                      height: 35,
                    }}
                  >
                    자산코드
                  </div>
                  <div className="flex w-full bg-white px-3">
                    <Form.Item name="assetName" noStyle>
                      <Input size="small" />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default AssetUserAgreement;
