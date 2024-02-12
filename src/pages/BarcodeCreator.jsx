import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ContentTitle } from "../commonstyles/Title";
import Barcode from "react-barcode";
import { Button, Form, Input, QRCode, Result, Space, Spin } from "antd";
import ReactToPrint, { useReactToPrint } from "react-to-print";

const BarcodeCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [barcodes, setBarcodes] = useState([]);
  const [barcodeInfo, setBarcodeInfo] = useState({
    barcodeValue: "",
    barcodeCount: 0,
  });

  const location = useLocation();
  const formRef = useRef();
  const componentRef = useRef();

  const onFinish = (values) => {
    setIsLoading(true);
    setBarcodeInfo(() => ({
      ...barcodeInfo,
      barcodeCount: parseInt(values.barcodeCount),
    }));

    const delayMilliseconds = Math.max(1000, parseInt(values.barcodeCount));

    setTimeout(() => {
      generateBarcode(values.barcodeValue, parseInt(values.barcodeCount))
        .then((data) => {
          setBarcodes([...data]);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, delayMilliseconds);
  };

  const generateBarcode = (value, count) => {
    return new Promise((resolve, reject) => {
      let datas = [];

      if (count > 0) {
        Array.from({ length: count }, (_, index) => {
          const treeId = String(index + 1).padStart(7, "0");
          const newCode = { bar: value, qr: value + treeId };

          datas.push({ ...newCode });
        });

        if (count === datas.length) {
          resolve(datas);
        } else {
          reject(new Error("Failed to generate barcodes"));
        }
      } else {
        resolve([]);
      }
    });
  };

  useEffect(() => {
    setIsLoading(false);
    if (location?.state.barcodeValue) {
      setBarcodeInfo(() => ({
        barcodeValue: location.state.barcodeValue,
      }));

      const { barcodeValue, barcodeCount } = location.state;
      formRef?.current.setFieldsValue({
        barcodeValue: barcodeValue,
      });
    }
  }, [location]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const BarcodePrintComponent = ({ barcodes }) => {
    return (
      <div ref={componentRef}>
        <div className="flex w-full h-full flex-wrap box-border px-5 mt-5 gap-2">
          {barcodes.length > 0 &&
            barcodes.map((barcode, bIdx) => {
              const { bar, qr } = barcode;
              return (
                <div
                  key={bIdx}
                  className="flex justify-center items-center border rounded-lg p-3 flex-col gap-y-5"
                >
                  <div className="flex flex-col items-center">
                    <QRCode value={JSON.stringify(barcode)} size={125} />
                    <span style={{ fontSize: "12px" }}>{qr}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <>
      {isLoading && (
        <div
          className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-white bg-opacity-50 z-50"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <Spin size="large" />
        </div>
      )}
      {!isLoading && !location?.state?.barcodeValue ? (
        <Result
          status="warning"
          title="바코드 생성을 위한 데이터를 불러오지 못했습니다."
          extra={
            <Button
              type="primary"
              className="bg-blue-500"
              onClick={() => {
                window.history.back();
              }}
            >
              되돌아가기
            </Button>
          }
        />
      ) : (
        <div className="flex w-full h-full ">
          <div className="flex w-full h-full flex-col bg-white rounded-lg pb-5">
            <div className="flex w-full ">
              <ContentTitle title="QR코드/바코드 생성" />
            </div>
            <div className="flex w-full h-full px-5 ">
              <div
                className="flex w-full h-full border rounded-lg p-2"
                style={{ maxHeight: "50px" }}
              >
                <Form
                  layout="inline"
                  labelCol={{
                    span: 7,
                  }}
                  onFinish={onFinish}
                  ref={formRef}
                >
                  <Form.Item name="barcodeValue" label="바코드">
                    <Input defaultValue={location?.state?.barcodeValue} />
                  </Form.Item>
                  <Form.Item name="barcodeCount" label="인쇄숫자">
                    <Input placeholder={location?.state?.barcodeCount} />
                  </Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      className="bg-blue-500"
                      htmlType="submit"
                    >
                      생성
                    </Button>{" "}
                    <Button onClick={handlePrint}>전체출력</Button>
                  </Space>
                </Form>
              </div>
            </div>
            <div className="flex w-full h-full flex-wrap box-border px-5 mt-5 gap-2">
              <BarcodePrintComponent barcodes={barcodes} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BarcodeCreator;
