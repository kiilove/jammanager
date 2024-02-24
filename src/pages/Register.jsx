import { Button, Checkbox, Form, Input, Space, notification } from "antd";
import Password from "antd/es/input/Password";
import React, { useRef, useState } from "react";
import { TermServiceText } from "../components/TermServiceV202402";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { Timestamp } from "firebase/firestore";
import { encryptObject, trimObjectValue } from "../functions";
import { useFirestoreAddData } from "../hooks/useFirestore";
import { useNavigate } from "react-router-dom";
import useFirebaseAuth from "../hooks/useFireAuth";
import {
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import {
  initCategory,
  initUserContract,
  initUserDepartment,
  initUserRank,
  initUserSpot,
  initUserStatus,
} from "../InitValues";

const initApplys = {
  serviceApply: false,
  serviceApplyAt: undefined,
  serviceVersion: "20240201",
  personalApply: false,
  personalApplyAt: undefined,
  personalVersion: "20240201",
  marketingApply: false,
  marketingApplyAt: "",
  marketingVersion: "20240201",
  marketingEmail: false,
  marketingSMS: false,
};

const allApplysTrue = {
  serviceApply: true,
  serviceApplyAt: Timestamp.fromDate(new Date()),
  serviceVersion: "20240201",
  personalApply: true,
  personalApplyAt: Timestamp.fromDate(new Date()),
  personalVersion: "20240201",
  marketingApply: true,
  marketingApplyAt: Timestamp.fromDate(new Date()),
  marketingVersion: "20240201",
  marketingEmail: true,
  marketingSMS: true,
};
const Register = () => {
  const loginRef = useRef();
  const companyRef = useRef();
  const extraRef = useRef();
  const allApplyRef = useRef();
  const serviceApplyRef = useRef();
  const personalApplyRef = useRef();
  const marketingApplyRef = useRef();
  const marketingEmailRef = useRef();
  const marketingSMSRef = useRef();

  const [applys, setApplys] = useState({ ...initApplys });
  const [checkedId, setCheckedId] = useState({ value: "", isUnique: false });

  const userAdd = useFirestoreAddData();
  const memberSettingAdd = useFirestoreAddData();
  const { checkExistID, signUpWithEmail } = useFirebaseAuth();

  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    apiType,
    title,
    message,
    placement,
    duration,
    maxCount
  ) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
      maxCount,
    });
  };

  const scriptUrl =
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(scriptUrl);

  const handleAddressComplete = (data) => {
    console.log(data.zonecode);
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    if (fullAddress !== "") {
      loginRef?.current.setFieldsValue({
        ...loginRef?.current.getFieldsValue(),
        companyZoneCode: data.zonecode,
        companyFullAddress: fullAddress,
        // compantExtraAddress:
        //   extraRef?.current.getFieldsValue().compantExtraAddress || "",
      });
    }
  };

  const handleZoneCodeSearch = () => {
    open({ onComplete: handleAddressComplete });
  };

  const handleRegisterFinished = (value) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 필수 입력 필드가 빈 값인지 확인
    const hasEmptyRequiredFields =
      !value.userEmail ||
      !value.userPassword ||
      !value.userPasswordVerify ||
      !value.companyName ||
      !value.companyTel;

    // 중복 체크가 완료되었는지 확인
    const isIdCheckedAndUnique = checkedId.isUnique;

    if (hasEmptyRequiredFields || !isIdCheckedAndUnique) {
      // 화면 맨 위로 스크롤

      if (hasEmptyRequiredFields) {
        // 필수 입력 필드가 빈 값인 경우 메시지 표시
        openNotification(
          "error",
          "입력 오류",
          "모든 필수 항목을 입력해주세요.",
          "topRight",
          3
        );
      } else if (!isIdCheckedAndUnique) {
        // 중복 체크가 안 된 경우 메시지 표시
        openNotification(
          "error",
          "중복 체크 오류",
          "아이디 중복 체크를 먼저 해주세요.",
          "topRight",
          3
        );
      }

      return; // 함수 종료
    } else {
      const encryptedValue = encryptObject(
        { ...trimObjectValue(value) },
        process.env.REACT_APP_SECRET_KEY
      );
      delete encryptedValue.userPasswordVerify;
      const newValue = { ...encryptedValue, ...applys };
      const trimValue = { ...trimObjectValue(value) };

      handleAddUser(trimValue, newValue);
    }
  };

  const handleAddUser = async (signInValue, profileValue) => {
    if (!profileValue) {
      return;
    }

    if (Object.values(profileValue).some((s) => s === undefined)) {
      const undefinedKeys = Object.keys(profileValue).map((key, kIdx) => {
        if (profileValue[key] === undefined) {
          return key;
        }
      });
      openNotification(
        "error",
        "회원가입 오류",
        `정확하지 않은 데이터가 포함되어있습니다.${JSON.stringify(
          undefinedKeys
        )}`,
        "topRight",
        3
      );
      return;
    }

    let newProfileValue = { ...profileValue };
    try {
      await signUpWithEmail(
        signInValue.userEmail,
        signInValue.userPassword,
        async (data) => {
          newProfileValue.userID = data.user.uid;
          try {
            await userAdd.addData(
              "members",
              { ...newProfileValue },
              async (data) => {
                const demoEndedAtDate = new Date();
                demoEndedAtDate.setDate(demoEndedAtDate.getDate() + 7); // 현재 날짜에 7일 추가
                const demoEndedAt = Timestamp.fromDate(demoEndedAtDate);

                await memberSettingAdd.addData(
                  "memberSetting",
                  {
                    userID: data.userID,
                    userStatus: [...initUserStatus],
                    userContract: [...initUserContract],
                    userSpot: [...initUserSpot],
                    userRank: [...initUserRank],
                    userDepartment: [...initUserDepartment],
                    assetCategories: [...initCategory],
                    firstCreatedAt: Timestamp.fromDate(new Date()),
                    memberShipType: "demo",
                    demoEndedAt,
                    memberShipExpiredAt: demoEndedAt,
                    isCompanyChildren: false,
                    companyLogo: [],
                    companyName: loginRef?.current.getFieldsValue().companyName,
                    companyChildren: [],
                  },
                  (data) => {
                    navigate("/success", { state: { message: "success" } });
                  }
                );
              }
            );
          } catch (error) {
            console.log(error);
          }
        }
      ).catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const sectionHeader = ({ title, context = null }) => (
    <div
      className="flex w-full h-full justify-center items-center mb-10 flex-col"
      style={{ borderBottom: "1px solid" }}
    >
      <span
        className="flex justify-start w-full text-gray-700 font-semibold"
        style={{
          fontSize: "18px",
        }}
      >
        {title}
      </span>
      <span
        className="flex justify-start w-full text-gray-700 "
        style={{
          fontSize: "10px",
        }}
      >
        {context}
      </span>
    </div>
  );
  return (
    <div className="flex w-full h-full flex-col justify-start items-center bg-gray-100 my-3">
      <div
        className="flex gap-y-1 w-full h-full flex-col justify-start items-center bg-white "
        style={{ maxWidth: "1000px" }}
      >
        <div className="flex h-14 justify-center items-center w-full">
          <span
            style={{
              fontSize: "20px",
              letterSpacing: "5px",
            }}
          >
            회원가입
          </span>
        </div>
        <Form
          labelCol={{
            span: 6,
          }}
          style={{
            maxWidth: "90%",
          }}
          size="large"
          labelAlign="right"
          ref={loginRef}
          onFinish={handleRegisterFinished}
        >
          <div className="flex h-14 justify-center items-center w-full">
            {sectionHeader({ title: "로그인 정보" })}
          </div>
          <Form.Item label="이메일" required>
            <Space.Compact className="w-full">
              <Form.Item
                name="userEmail"
                noStyle
                rules={[
                  { required: true, message: "이메일을 입력해주세요." },
                  { type: "email", message: "유효한 이메일 형식이 아닙니다." },
                ]}
              >
                <Input
                  className="rounded"
                  placeholder="이메일 입력(필수)"
                  onChange={(e) => {
                    e.target.value === ""
                      ? setCheckedId({ value: "", isUnique: false })
                      : setCheckedId(() => ({
                          isUnique: false,
                          value: e.target.value,
                        }));
                  }}
                />
              </Form.Item>
              <Button
                disabled={loginRef?.current?.getFieldsValue().userId === ""}
                onClick={() => {
                  new Promise((resolve, reject) => {
                    const userEmail =
                      loginRef?.current.getFieldsValue().userEmail;
                    resolve(checkExistID("userEmail", userEmail));
                  })
                    .then((isUnique) => {
                      setCheckedId((prevState) => ({
                        ...prevState,
                        isUnique: isUnique,
                      }));
                    })
                    .catch((error) => {
                      console.error(error);
                      // Handle any errors here
                    });
                }}
                type={checkedId.isUnique ? "primary" : "default"}
                className={checkedId.isUnique && "bg-blue-500"}
              >
                {checkedId.isUnique ? (
                  <div className="flex justify-start items-center h-full">
                    사용가능
                    <span className="text-lg ml-2">
                      <IoCheckmarkCircleOutline />
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-start items-center h-full">
                    중복체크
                    <span className="text-lg ml-2">
                      <IoAlertCircleOutline />
                    </span>
                  </div>
                )}
              </Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item
            name="userPassword"
            label="비밀번호"
            rules={[
              { required: true, message: "비밀번호를 입력해주세요." },
              { min: 6, message: "비밀번호는 6자 이상이어야 합니다." },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message:
                  "비밀번호는 6자 이상이며, 최소 한 개의 영문자와 숫자를 포함해야 합니다.",
              },
            ]}
          >
            <Input.Password
              className=" rounded"
              placeholder="6이상 영문과 숫자 조합"
              visibilityToggle={false}
            />
          </Form.Item>
          <Form.Item
            name="userPasswordVerify"
            label="비밀번호 확인"
            rules={[
              { required: true, message: "비밀번호 확인을 입력해주세요." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("userPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("입력하신 비밀번호와 일치하지 않습니다.")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              className=" rounded "
              placeholder="비밀번호 확인"
              visibilityToggle={false}
            />
          </Form.Item>
          <div className="flex h-14 justify-center items-center w-full">
            {sectionHeader({ title: "회사(개인) 정보" })}
          </div>
          <Form.Item name="companyName" label="회사명(이름)" required>
            <Input
              className=" rounded"
              placeholder="회사명(개인이름) 입력(필수)"
            />
          </Form.Item>
          <Form.Item name="companyTel" label="전화번호" required>
            <Input
              className=" rounded"
              placeholder="대표전화(휴대전화), 숫자만 입력"
              required
            />
          </Form.Item>
          <div className="flex h-14 justify-center items-center w-full">
            {sectionHeader({ title: "선택 정보" })}
          </div>
          <Form.Item label="우편번호">
            <Space.Compact>
              <Form.Item label="우편번호" name="companyZoneCode" noStyle>
                <Input
                  className=" rounded"
                  style={{ width: "100px" }}
                  placeholder="우편번호"
                  disabled
                />
              </Form.Item>
              <Button
                type="primary"
                className="bg-blue-500 rounded"
                onClick={() => handleZoneCodeSearch()}
              >
                검색
              </Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item label="주소" name="companyFullAddress">
            <Input className=" rounded" placeholder="주소" />
          </Form.Item>
          <Form.Item label="나머지 주소" name="companyExtraAddress">
            <Input className=" rounded" placeholder="나머지주소" />
          </Form.Item>
          <Form.Item name="companyTelExtra" label="추가 전화번호">
            <Input className=" rounded" placeholder="숫자만 입력" />
          </Form.Item>
          <div className="flex h-20 justify-center items-center w-full">
            {sectionHeader({
              title: (
                <div className="flex w-full gap-x-4 mb-1">
                  <input
                    type="checkbox"
                    name="allApply"
                    id="allApply"
                    ref={allApplyRef}
                    checked={
                      applys.serviceApply &&
                      applys.personalApply &&
                      applys.marketingApply
                    }
                    onClick={(e) => {
                      e.target.checked
                        ? setApplys(() => ({ ...allApplysTrue }))
                        : setApplys(() => ({ ...initApplys }));
                    }}
                    className=" ring-0 focus:outline-none"
                    label="전체 동의"
                  />
                  <label htmlFor="allApply">
                    <span
                      className="flex justify-start w-full text-gray-700 font-semibold"
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      전체 동의
                    </span>
                  </label>
                </div>
              ),
              context: (
                <div className="flex w-full">
                  서비스 이용약관, 개인정보 수집 및 이용, 마케팅 수신(선택)에
                  모두 동의합니다.
                  <br />
                  선택항목 동의를 거부하셔도 서비스 이용이 가능합니다.
                </div>
              ),
            })}
          </div>
          <div className="flex h-auto justify-start items-center w-full gap-x-2">
            <input
              type="checkbox"
              name="serviceApply"
              id="serviceApply"
              ref={serviceApplyRef}
              checked={applys.serviceApply}
              onClick={(e) => {
                setApplys(() => ({
                  ...applys,
                  serviceApply: e.target.checked,
                  serviceApplyAt: e.target.checked
                    ? Timestamp.fromDate(new Date())
                    : undefined,
                }));
              }}
            />
            <label htmlFor="serviceApply">
              <span className="text-sm">
                서비스 이용약관 동의<span>(필수)</span>
              </span>
            </label>
          </div>
          <div className="flex flex-wrap " style={{ height: "110px" }}>
            <div
              className="flex bg-gray-100 rounded p-2 overflow-y-auto flex-wrap"
              style={{ fontSize: "10px", maxHeight: "100px" }}
            >
              <TermServiceText />
            </div>
          </div>
          <div className="flex h-auto justify-start items-center w-full gap-x-2 mt-2">
            <input
              type="checkbox"
              name="personalApply"
              id="personalApply"
              ref={personalApplyRef}
              checked={applys.personalApply}
              onClick={(e) => {
                setApplys(() => ({
                  ...applys,
                  personalApply: e.target.checked,
                  personalApplyAt: e.target.checked
                    ? Timestamp.fromDate(new Date())
                    : undefined,
                }));
              }}
            />
            <label htmlFor="personalApply">
              <span className="text-sm">
                개인정보 수집 및 이용 동의<span>(필수)</span>
              </span>
            </label>
          </div>
          <div className="flex flex-wrap" style={{ height: "110px" }}>
            <div
              className="flex bg-gray-100 rounded p-2 overflow-y-auto flex-wrap"
              style={{ fontSize: "10px", maxHeight: "100px" }}
            >
              <TermServiceText />
            </div>
          </div>
          <div className="flex h-auto justify-start items-center w-full gap-x-2 mt-2">
            <input
              type="checkbox"
              name="marketingApply"
              id="marketingApply"
              ref={marketingApplyRef}
              checked={applys.marketingApply}
              onClick={(e) => {
                setApplys(() => ({
                  ...applys,
                  marketingApply: e.target.checked,
                  marketingApplyAt: e.target.checked
                    ? Timestamp.fromDate(new Date())
                    : "",
                  marketingEmail: e.target.checked ? true : false,
                  marketingSMS: e.target.checked ? true : false,
                }));
              }}
            />
            <label htmlFor="marketingApply">
              <span className="text-sm">
                마케팅 수신 동의<span>(선택)</span>
              </span>
            </label>
          </div>
          <div className="flex w-full px-7 flex-wrap gap-x-2 text-xs justify-start items-center">
            <input
              type="checkbox"
              name="marketingEmail"
              id="marketingEmail"
              ref={marketingEmailRef}
              checked={applys.marketingEmail}
              disabled={!applys.marketingApply}
              onClick={(e) => {
                setApplys(() => ({
                  ...applys,
                  marketingEmail: e.target.checked,
                }));
              }}
            />
            <label htmlFor="marketingEmail">이메일</label>
            <input
              type="checkbox"
              name="marketingSMS"
              id="marketingSMS"
              ref={marketingSMSRef}
              checked={applys.marketingSMS}
              disabled={!applys.marketingApply}
              onClick={(e) => {
                setApplys(() => ({
                  ...applys,
                  marketingSMS: e.target.checked,
                }));
              }}
            />
            <label htmlFor="marketingSMS">SMS</label>
          </div>{" "}
          <div
            className="flex w-full  justify-center items-center my-10"
            style={{
              height: "50px",
            }}
          >
            <div className="flex w-full h-full md:px-0">
              <Button
                className=" bg-gray-700 w-full h-full rounded"
                style={{ border: "1px solid", height: "50px" }}
                disabled={!applys.serviceApply || !applys.personalApply}
                onClick={() =>
                  handleRegisterFinished(loginRef?.current.getFieldsValue())
                }
              >
                {!applys.serviceApply || !applys.personalApply ? (
                  <span
                    className="text-gray-800"
                    style={{ letterSpacing: "1px" }}
                  >
                    약관 동의가 필요합니다.
                  </span>
                ) : (
                  <span
                    className="text-white"
                    style={{ letterSpacing: "14px" }}
                  >
                    회원가입
                  </span>
                )}
              </Button>
            </div>
          </div>
        </Form>
      </div>
      {contextHolder}
    </div>
  );
};

export default Register;
