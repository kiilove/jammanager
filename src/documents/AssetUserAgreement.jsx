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
const today = new Date();
const borderColor = "bg-gray-600";
const defaultTemplate = {
  documentTitle: "자산 사용 동의서",
  documentDate: today,
};
const AssetUserAgreement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentTemplate, setDocumentTemplate] = useState({});
  const [IDLength, setIDLength] = useState(0);
  const { memberSettings } = useContext(CurrentLoginContext);
  const documentQuery = useFirestoreQuery();

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
    if (memberSettings?.assetUserAgreement) {
      setDocumentTemplate({ ...memberSettings.assetUserAgreement });
    } else {
      setDocumentTemplate(() => ({ ...initAssetUserAgreement }));
      console.log(initAssetUserAgreement);
    }
  }, [memberSettings]);

  return (
    <>
      {isLoading && (
        <div className="w-full h-screen justify-center items-center flex">
          <Spin />
        </div>
      )}
      {!isLoading && documentTemplate?.docuTitle?.label && (
        <div
          className="flex w-full h-full p-2"
          style={{ fontFamily: "맑은 고딕, 돋움, 굴림" }}
        >
          <Form style={{ width: "100%" }}>
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
                  {documentTemplate?.docuTitle?.label}
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
                    <Form.Item name="docuIssuer" noStyle>
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
                    <Form.Item name="docuIssuer" noStyle>
                      <Input size="small" />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div
                className="flex w-full flex-col justify-center items-center"
                style={{ height: "auto", fontSize: 13 }}
              >
                <div className="flex w-full justify-start items-center">
                  자산정보 :
                </div>
                <div
                  className="flex w-full flex-col justify-center items-center border border-gray-400"
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
                      <Form.Item name="docuIssuer" noStyle>
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
                      <Form.Item name="docuIssuer" noStyle>
                        <Input size="small" />
                      </Form.Item>
                    </div>
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
