import React, { useContext, useEffect, useRef } from "react";
import { ContentTitle } from "../commonstyles/Title";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  notification,
} from "antd";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import { formatPhoneNumber, generateUUID, getToday } from "../functions";
import { Timestamp } from "firebase/firestore";
import { useFirestoreAddData } from "../hooks/useFirestore";
import { CurrentLoginContext } from "../context/CurrentLogin";

const NewUser = () => {
  const { memberSettings } = useContext(CurrentLoginContext);
  const formRef = useRef();
  const userAdd = useFirestoreAddData();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (apiType, title, message, placement, duration) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
    });
  };

  const handleAddData = async (data) => {
    try {
      await userAdd.addData("users", { ...data }, () => {
        openNotification(
          "success",
          "추가 성공",
          "구성원을 추가했습니다.",
          "topRight",
          3
        );
        initFormValue(formRef);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFinish = (value) => {
    // userEnteringDate를 Date 객체로 변환한 후 Firestore Timestamp로 변환
    const userEnteringDate = value.userEnteringDate
      ? Timestamp.fromDate(value.userEnteringDate.toDate())
      : "";

    // value 객체의 각 필드를 확인하고 undefined인 경우 빈 문자열로 대체
    const newValue = Object.keys(value).reduce((acc, key) => {
      acc[key] = value[key] === undefined ? "" : value[key];
      return acc;
    }, {});

    // userEnteringDate와 createdAt 필드 추가
    newValue.userEnteringDate = userEnteringDate;
    newValue.createdAt = Timestamp.fromDate(new Date());

    handleAddData(newValue);
  };

  const initFormValue = (ref) => {
    ref?.current.resetFields();
    ref?.current.setFieldsValue({
      ...ref?.current.getFieldsValue(),
      userUid: generateUUID(),
      userEnteringDate: dayjs(), // 현재 날짜를 dayjs 객체로 설정
    });
  };

  const isPhoneNumberValid = (phoneNumber) => {
    // 여기서 phoneNumber의 형식이 올바른지 확인하고 결과를 반환합니다.
    // 예시: 정규식을 사용하여 형식을 검사
    const regex = /^(\d{2,3})-(\d{3,4})-(\d{4})$/; // 간단한 예시 형식
    return regex.test(phoneNumber);
  };

  useEffect(() => {
    initFormValue(formRef);
  }, []);

  return (
    <div
      className="flex w-full h-full flex-col rounded-lg"
      style={{
        backgroundColor: "#fff",
        minHeight: "100%",
      }}
    >
      <div className="flex w-full ">
        <ContentTitle title="구성원추가" />
      </div>
      <div className="flex w-full">
        <div className="flex w-full lg:w-1/2 justify-center items-center px-5 ">
          <div
            className="flex border w-full h-full rounded-lg p-5 "
            style={{ minHeight: "150px" }}
          >
            <Form
              labelCol={{
                span: 4,
              }}
              style={{
                width: "100%",
              }}
              labelAlign="right"
              ref={formRef}
              onFinish={handleFinish}
              autoComplete="off"
            >
              <Form.Item name="userUid" label="관리번호">
                <Input disabled style={{ width: "90%" }} />
              </Form.Item>
              <Form.Item name="userIdNumber" label="사번">
                <Input style={{ width: "90%" }} />
              </Form.Item>
              <Form.Item name="userName" label="이름">
                <Input style={{ width: "90%" }} />
              </Form.Item>
              <Form.Item name="userPhoneNumber" label="사내번호">
                <Input style={{ width: "90%" }} />
              </Form.Item>{" "}
              <Form.Item name="userMobileNumber" label="휴대전화">
                <Input style={{ width: "90%" }} />
              </Form.Item>
              <Form.Item name="userEmail" label="이메일">
                <Input style={{ width: "90%" }} type="email" />
              </Form.Item>
              <Form.Item name="userDepartment" label="부서명">
                <Input style={{ width: "90%" }} />
              </Form.Item>
              <Form.Item name="userSpot" label="직위">
                <Input style={{ width: "90%" }} />
              </Form.Item>
              <Form.Item name="userRank" label="직급">
                <Input style={{ width: "90%" }} />
              </Form.Item>
              <Form.Item name="userEnteringDate" label="입사일자">
                <DatePicker
                  locale={locale}
                  defaultValue={dayjs()} // 현재 날짜로 설정
                  format="YYYY-MM-DD" // 필요에 따라 형식 지정
                />
              </Form.Item>
              <div className="flex w-full justify-end items-center">
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

export default NewUser;
