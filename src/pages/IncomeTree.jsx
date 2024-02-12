import React, { useEffect, useRef, useState } from "react";
import { ContentTitle } from "../commonstyles/Title";
import locale from "antd/es/date-picker/locale/ko_KR";
import "dayjs/locale/ko";

import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import { getDateFormat, getToday } from "../functions";
import dayjs from "dayjs";

const IncomeTree = () => {
  const formRef = useRef();
  const [currentDate, setCurrentDate] = useState();

  const initFormValue = () => {
    const today = getToday();
    console.log(today);
    formRef?.current.setFieldsValue({
      ...formRef?.current.getFieldsValue(),
      purchaseType: "youngTree",
      planingBlock: "unknown",
      purchaseDate: dayjs(new Date()),
    });
  };

  useEffect(() => {
    initFormValue();
  }, []);

  const onFinish = (value) => {
    console.log(value);
    console.log(formRef?.current.getFieldsValue());
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const handlePurchaseDate = (date, dateString) => {
    console.log(dateString);
    setCurrentDate(dateString);
  };

  return (
    <div
      className="flex w-full h-full flex-col rounded-lg"
      style={{
        backgroundColor: "#fff",
        minHeight: "100%",
      }}
    >
      <div className="flex w-full ">
        <ContentTitle title="입고관리" />
      </div>
      <div className="flex w-full justify-center items-center px-5">
        <div
          className="flex border w-full h-full rounded-lg p-5"
          style={{ minHeight: "150px" }}
        >
          <Form
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 26,
            }}
            style={{
              maxWidth: 600,
            }}
            ref={formRef}
            onFinish={onFinish}
          >
            <Form.Item label="입고종류">
              <Space>
                <Form.Item name="purchaseType" noStyle>
                  <Select defaultValue="youngTree" style={{ width: "100px" }}>
                    <Select.Option value="seed">종자</Select.Option>
                    <Select.Option value="youngTree">묘목</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="treeType" noStyle>
                  <Select defaultValue="young10cm" style={{ width: "120px" }}>
                    <Select.Option value="baby">유묘</Select.Option>
                    <Select.Option value="young10cm">10cm포트묘</Select.Option>
                    <Select.Option value="young15cm">15cm포트묘</Select.Option>
                  </Select>
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item name="supplierName" label="매입처">
              <Input />
            </Form.Item>
            <Form.Item
              name="purchaseDate"
              label="일자"
              rules={[{ required: true, message: "입고일자를 선택해주세요" }]}
            >
              <DatePicker
                locale={locale}
                onChange={handlePurchaseDate}
                defaultValue={dayjs(new Date())}
              />
            </Form.Item>
            <Form.Item name="purchaseCount" label="입고수량">
              <Input suffix="주" />
            </Form.Item>
            <Form.Item name="unitCost" label="단가">
              <Input suffix="루피아" />
            </Form.Item>
            <Form.Item name="purchasePrice" label="총액">
              <Input suffix="루피아" />
            </Form.Item>
            <Form.Item name="planingBlock" label="식재블록">
              <Select defaultValue="unknown">
                <Select.Option value="unknown">미정</Select.Option>
                <Select.Option value="A">A</Select.Option>
                <Select.Option value="B">B</Select.Option>
                <Select.Option value="C">C</Select.Option>
                <Select.Option value="D">D</Select.Option>
              </Select>
            </Form.Item>
            <Button htmlType="submit" type="primary" className="bg-blue-600">
              저장
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default IncomeTree;
