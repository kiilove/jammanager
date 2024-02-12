import React, { useEffect, useRef, useState } from "react";
import { ContentTitle } from "../commonstyles/Title";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  notification,
} from "antd";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import { getToday } from "../functions";
import { useFirestoreAddData, useFirestoreQuery } from "../hooks/useFirestore";
import useNotification from "antd/es/notification/useNotification";
import { Timestamp, where } from "firebase/firestore";
const projectArray = [];
const NewSowing = () => {
  const [projectDate, setProjuctDate] = useState(dayjs(new Date()));
  const [seedCountFloat, setSeedCountFloat] = useState(0);

  const firestoreAdd = useFirestoreAddData();
  const firestoreQuery = useFirestoreQuery();

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (apiType, title, message, placement, duration) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
    });
  };
  const formRef = useRef();

  const initFormValue = () => {
    formRef?.current.setFieldsValue({
      ...formRef?.current.getFieldsValue(),
      seedPurchaseOfficeName: "",
      seedName: "Elaeis guineensis",
      seedSowingDate: dayjs(new Date()),
    });
  };

  const makeProjectId = async (propDate) => {
    let dataLength = 0;
    const projectYear = propDate.year();
    const conditions = [
      where("seedSowingDate", ">=", new Date(`${projectYear}-01-01`)),
      where("seedSowingDate", "<=", new Date(`${projectYear}-12-31`)),
    ];
    try {
      firestoreQuery.getDocuments(
        "sowings",
        (data) => {
          dataLength = data.length + 1;
          const projectNumber = dataLength.toString().padStart(3, "0");
          const newProjuctId = projectYear + projectNumber;
          if (!isNaN(projectNumber)) {
            formRef?.current.setFieldsValue({
              ...formRef?.current.getFieldsValue(),
              seedProjectName: newProjuctId,
            });
          }
        },
        conditions
      );
    } catch (error) {
      console.log(error);
    }

    const projectNumber = String(dataLength.length + 1).padStart(3, "0");

    const newProjuctId = projectYear + projectNumber;

    formRef?.current.setFieldsValue({
      ...formRef?.current.getFieldsValue(),
      seedProjectName: newProjuctId,
    });
  };

  const validateInput = (rule, value, callback) => {
    const parsedValue = parseFloat(value.replaceAll(",", ""), 10); // 문자열을 정수로 변환

    if (!value) {
      callback("숫자를 입력해주세요."); // 필수 필드 오류 메시지
    } else if (isNaN(parsedValue) || !Number(parsedValue)) {
      callback("숫자와 소수점만 입력하세요.");
    } else {
      setSeedCountFloat(parsedValue);
      callback();
    }
  };
  const onFinish = async (values) => {
    const newValue = {
      ...values,
      seedSowing: seedCountFloat,
      seedSowingDate: values.seedSowingDate.toDate(),
      isActive: true,
    };

    try {
      await firestoreAdd.addData("sowings", { ...newValue }, () => {
        openNotification("success", "추가", "저장되었습니다.", "top", 2);
      });
    } catch (error) {
      openNotification("error", "오류", error.message, "top", 2);
      console.log(error);
    }
  };

  useEffect(() => {
    initFormValue();
  }, []);

  useEffect(() => {
    // console.log(formRef?.current.getFieldsValue().seedSowingDate);
    makeProjectId(projectDate);
  }, [projectDate]);

  return (
    <div
      className="flex w-full h-full flex-col rounded-lg"
      style={{
        backgroundColor: "#fff",
        minHeight: "100%",
      }}
    >
      <div className="flex w-full ">
        <ContentTitle title="신규파종" />
      </div>
      <div className="flex w-full">
        <div className="flex w-full lg:w-1/2 justify-center items-center px-5 ">
          <div
            className="flex border w-full h-full rounded-lg p-5 "
            style={{ minHeight: "150px" }}
          >
            <Form
              labelCol={{
                span: 6,
              }}
              style={{
                width: "100%",
              }}
              labelAlign="right"
              onFinish={onFinish}
              ref={formRef}
            >
              <Form.Item name="seedProjectName" label="프로젝트ID">
                <Input
                  className="w-full"
                  style={{ maxWidth: 400, minWidth: 200 }}
                />
              </Form.Item>
              <Form.Item
                name="seedSowingDate"
                label="파종일자"
                rules={[{ required: true, message: "파종일자를 선택해주세요" }]}
              >
                <DatePicker
                  locale={locale}
                  defaultValue={dayjs(new Date())}
                  onChange={(e) => {
                    setProjuctDate(e);
                  }}
                />
              </Form.Item>
              <Form.Item name="seedName" label="종자명">
                <Input
                  className="w-full"
                  style={{ maxWidth: 400, minWidth: 200 }}
                />
              </Form.Item>
              <Form.Item name="seedPurchaseOfficeName" label="매입처">
                <Input
                  className="w-full"
                  style={{ maxWidth: 400, minWidth: 200 }}
                />
              </Form.Item>

              <Form.Item
                name="seedSowing"
                label="파종"
                rules={[{ validator: validateInput }]}
              >
                <Space>
                  <Form.Item noStyle name="seedSowingType">
                    <Radio.Group defaultValue="weight">
                      <Radio value="weight">무게</Radio>
                      <Radio value="count">수량</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <InputNumber
                    decimalSeparator="."
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    style={{ textAlign: "right", width: 150 }}
                  />
                  <span>
                    {formRef?.current?.getFieldsValue().seedSowingType ===
                    "weight"
                      ? "kg"
                      : "개"}
                  </span>
                  {/* <Button style={{ width: "70px" }}>+10M</Button>
                <Button style={{ width: "70px" }}>+1M</Button>
                <Button style={{ width: "70px" }}>+1K</Button>
                <Button style={{ width: "70px" }}>0</Button> */}
                </Space>
              </Form.Item>
              <div className="flex w-full justify-start items-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-500"
                >
                  저장
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      {contextHolder}
    </div>
  );
};

export default NewSowing;
