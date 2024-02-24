import React, { useContext, useEffect, useRef, useState } from "react";
import { ContentTitle } from "../commonstyles/Title";
import {
  AutoComplete,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  notification,
} from "antd";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import {
  formatPhoneNumber,
  generateUUID,
  generateUniqueCompanyID,
  getToday,
  groupByKey,
} from "../functions";
import { Timestamp, where } from "firebase/firestore";
import { useFirestoreAddData, useFirestoreQuery } from "../hooks/useFirestore";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { useNavigate } from "react-router-dom";

const NewUser = () => {
  const [userCompanyIDList, setUserCompanyIDList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCompanyID, setNewCompanyID] = useState("");
  const [userDepartmentOptions, setUserDepartmentOptions] = useState([]);
  const [userSpotOptions, setUserSpotOptions] = useState([]);
  const [userRankOptions, setUserRankOptions] = useState([]);
  const [grouped, setGrouped] = useState({
    groupedDepartment: [],
    groupedSpot: [],
    groupedRank: [],
  });

  const [companyID, setCompanyID] = useState("");
  const { memberSettings } = useContext(CurrentLoginContext);
  const formRef = useRef();
  const userAdd = useFirestoreAddData();
  const userQuery = useFirestoreQuery();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (apiType, title, message, placement, duration) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
    });
  };
  const [userForm] = Form.useForm();

  const handleAddData = async (data, initForm = true) => {
    try {
      await userAdd.addData("users", { ...data }, () => {
        openNotification(
          "success",
          "추가 성공",
          "구성원을 추가했습니다.",
          "topRight",
          3
        );
        initForm ? initFormValue(formRef) : initFormValueContinue(formRef);
        userForm.setFieldValue("userCompanyID", "");
        setCompanyID("");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const valueCheck = (value) => {
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
    newValue.userOwner = memberSettings.userID;
    newValue.userUID = generateUUID();

    return newValue;
  };
  const handleFinish = (value) => {
    const newValue = valueCheck(value);

    handleAddData(newValue, true);
  };

  const handleFinishContinue = (value) => {
    const newValue = valueCheck(value);

    handleAddData(newValue, false);
  };

  const initFormValue = (ref) => {
    ref?.current.resetFields();
    ref?.current.setFieldsValue({
      ...ref?.current.getFieldsValue(),
      userUid: generateUUID(),
      userEnteringDate: dayjs(), // 현재 날짜를 dayjs 객체로 설정
    });
    fetchUser(memberSettings.userID);
  };

  const initFormValueContinue = (ref) => {
    ref?.current.setFieldsValue({
      ...ref?.current.getFieldsValue(),
      userUid: generateUUID(),
    });
    fetchUser(memberSettings.userID);
  };

  const isPhoneNumberValid = (phoneNumber) => {
    // 여기서 phoneNumber의 형식이 올바른지 확인하고 결과를 반환합니다.
    // 예시: 정규식을 사용하여 형식을 검사
    const regex = /^(\d{2,3})-(\d{3,4})-(\d{4})$/; // 간단한 예시 형식
    return regex.test(phoneNumber);
  };

  const fetchUser = async (value) => {
    const condition = [where("userOwner", "==", value)];
    try {
      await userQuery.getDocuments(
        "users",
        (data) => {
          if (data.lengt > 0) {
            const companyIDs = data.map((user, uIdx) => {
              const { userCompanyID } = user;
              return userCompanyID;
            });

            const newID = generateUniqueCompanyID(companyIDs);

            setNewCompanyID(newID);
          }
        },
        condition
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // 3초 후에 memberSettings 값이 없으면 홈으로 리디렉션
      if (!memberSettings || Object.keys(memberSettings).length === 0) {
        notification.error({
          message: "데이터 로딩 문제",
          description: "데이터 로딩에 문제가 발생했습니다. 홈으로 이동합니다.",
          duration: 3,
          onClose: () => navigate("/"),
        });
      } else {
        // memberSettings 값이 있으면 데이터 로딩 완료
        setIsLoading(false);
      }
    }, 3000);

    // Cleanup 함수에서 setTimeout 취소
    return () => clearTimeout(timer);
  }, [memberSettings, navigate]);

  useEffect(() => {
    if (memberSettings && Object.keys(memberSettings).length > 0) {
      setIsLoading(false);
      fetchUser(memberSettings.userID);
      userForm.setFieldValue("userEnteringDate", dayjs());
    }
  }, [memberSettings]);

  return (
    <>
      {isLoading && (
        <div className="w-full h-screen flex justify-center items-center">
          <Spin></Spin>
        </div>
      )}
      {!isLoading && (
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
                  form={userForm}
                  onFinish={handleFinish}
                  autoComplete="off"
                >
                  <Form.Item name="userUID" label="관리번호" className="hidden">
                    <Input disabled style={{ width: "90%" }} />
                  </Form.Item>
                  <Form.Item label="사번">
                    <Form.Item name="userCompanyID" noStyle>
                      <Space.Compact style={{ width: "90%" }}>
                        <Input
                          value={companyID}
                          onChange={(e) => setCompanyID(() => e.target.value)}
                        />
                        <Button
                          onClick={() => {
                            const newID =
                              generateUniqueCompanyID(userCompanyIDList);
                            setCompanyID(newID);
                            userForm.setFieldValue("userCompanyID", newID);
                          }}
                        >
                          자동생성
                        </Button>
                      </Space.Compact>
                    </Form.Item>
                  </Form.Item>
                  <Form.Item name="userName" label="이름">
                    <Input style={{ width: "90%" }} />
                  </Form.Item>
                  <Form.Item name="userCompanyPhoneNumber" label="사내번호">
                    <Input style={{ width: "90%" }} />
                  </Form.Item>
                  <Form.Item name="userMobileNumber" label="휴대전화">
                    <Input style={{ width: "90%" }} />
                  </Form.Item>
                  <Form.Item name="userEmail" label="이메일">
                    <Input style={{ width: "90%" }} type="email" />
                  </Form.Item>
                  <Form.Item name="userDepartment" label="부서명">
                    <Select
                      options={[...memberSettings?.userDepartment]}
                      style={{ width: 250 }}
                    />
                  </Form.Item>
                  <Form.Item label="직위/직급">
                    <Space>
                      <Form.Item name="userSpot" noStyle>
                        <Select
                          options={[...memberSettings?.userSpot] ?? []}
                          style={{ width: 180 }}
                        />
                      </Form.Item>
                      <Form.Item name="userRank" noStyle>
                        <Select
                          options={[...memberSettings?.userRank] ?? []}
                          style={{ width: 180 }}
                        />
                      </Form.Item>
                    </Space>
                  </Form.Item>{" "}
                  <Form.Item label="계약/상태">
                    <Space>
                      <Form.Item name="userContract" noStyle>
                        <Select
                          options={[...memberSettings?.userContract] ?? []}
                          style={{ width: 180 }}
                        />
                      </Form.Item>
                      <Form.Item name="userStatus" noStyle>
                        <Select
                          options={[...memberSettings?.userStatus] ?? []}
                          style={{ width: 180 }}
                        />
                      </Form.Item>
                    </Space>
                  </Form.Item>
                  <Form.Item name="userEnteringDate" label="입사일자">
                    <DatePicker
                      locale={locale}
                      defaultValue={dayjs()} // 현재 날짜로 설정
                      format="YYYY-MM-DD" // 필요에 따라 형식 지정
                    />
                  </Form.Item>
                  <div className="flex w-full justify-end items-center gap-x-2">
                    <Button
                      type="default"
                      htmlType="button"
                      onClick={() =>
                        handleFinishContinue(userForm.getFieldsValue())
                      }
                    >
                      저장후 계속
                    </Button>
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
        </div>
      )}

      {contextHolder}
    </>
  );
};

export default NewUser;
