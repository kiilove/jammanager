import { Button, Form, Input, Result, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ContentTitle } from "../commonstyles/Title";
import Barcode from "react-barcode";

const BarcodeCreator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [barcodeInfo, setBarcodeInfo] = useState({
    barcodeValue: "",
  });

  const location = useLocation();
  const formRef = useRef();

  const onFinish = (values) => {};

  useEffect(() => {
    console.log(barcodeInfo);
  }, [barcodeInfo]);

  useEffect(() => {
    setIsLoading(false);
    if (location?.state.barcodeValue) {
      setBarcodeInfo(() => ({
        barcodeValue: location.state.barcodeValue,
      }));

      const { barcodeValue, barcodeCount } = location.state;
      formRef?.current.setFieldsValue({
        barcodeValue: barcodeValue,
        barcodeCount: barcodeCount,
      });
    }
  }, [location]);

  return (
    <>
      {isLoading && (
        <div className="w-full h-full flex justify-center items-center">
          <Spin />
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
              <ContentTitle title="바코드생성" />
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

                  <Button
                    type="primary"
                    className="bg-blue-500"
                    htmlType="submit"
                  >
                    인쇄 미리보기
                  </Button>
                </Form>
              </div>
            </div>
            <div className="flex w-full h-full flex-wrap box-border px-5 mt-5">
              {barcodeInfo.barcodeValue && (
                <div className="flex justify-center items-center border rounded-lg p-3">
                  <Barcode
                    value={barcodeInfo.barcodeValue}
                    fontSize={18}
                    textMargin={3}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BarcodeCreator;
