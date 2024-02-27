import React, { useContext, useEffect, useRef, useState } from "react";
import { ContentTitle } from "../commonstyles/Title";

import { RiBookletLine, RiDeleteBin5Line } from "react-icons/ri";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Input,
  List,
  Menu,
  Modal,
  Popconfirm,
  Result,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Upload,
  notification,
} from "antd";
import useImageUpload from "../hooks/useFireStorage";
import { generateFileName, generateUUID } from "../functions";
import "./AutoComplete.css";
import { CurrentLoginContext } from "../context/CurrentLogin";
import useFirebaseAuth from "../hooks/useFireAuth";
import { useFirestoreUpdateData } from "../hooks/useFirestore";
import { initDepreciationPeriod, initDepreciationType } from "../InitValues";
import SettingsMenu from "../components/SettingsMenu";
import CompanySetting from "../components/CompanySetting";
import { useMediaQuery } from "react-responsive";
import CategorySetting from "../components/CategorySetting";
import { FaBuilding } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import HRSetting from "../components/HRSetting";
import _ from "lodash";

const ServiceSetting = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenu, setIsMenu] = useState(false);
  const [currentSelected, setCurrentSelected] = useState("title1");

  const [currentComponent, setCurrentComponent] = useState(<div></div>);

  const [form] = Form.useForm();

  const { memberSettings, setMemberSettings } = useContext(CurrentLoginContext);

  const { logOut } = useFirebaseAuth;
  const settingsUpdate = useFirestoreUpdateData();

  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1223px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });
  const prevSettingsRef = useRef({
    assetCategories: [],
    userContract: [],
    userDepartment: [],
    userRank: [],
    userSpot: [],
    userStatus: [],
  });
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
  const onUpdate = async (id, value, msg = true) => {
    const newValue = { ...value };
    Object.keys(newValue).map((key, kIdx) => {
      if (newValue[key] === undefined) {
        newValue[key] = "";
      }
    });

    try {
      await settingsUpdate.updateData("memberSetting", id, newValue, (data) => {
        setMemberSettings(() => ({ ...data }));
        setIsLoading(false);
        if (msg) {
          openNotification(
            "success",
            "업데이트 성공",
            "정상적으로 업데이트 되었습니다.",
            "top",
            3
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  function getItem(label, key, link, icon, component, children, type) {
    return {
      key,
      icon,
      children,
      label,
      link,
      type,
      component,
    };
  }
  const menus = [
    getItem(
      "회사설정",
      "title1",
      undefined,

      <FaBuilding />,
      <CompanySetting onUpdate={onUpdate} />
    ),
    getItem(
      "자산분류",
      "title2",
      undefined,
      <RiBookletLine />,
      <CategorySetting onUpdate={onUpdate} />
    ),
    getItem(
      "인사설정",
      "title3",
      undefined,
      <LuUsers />,
      <HRSetting onUpdate={onUpdate} />
    ),
  ];

  const menuClick = (value) => {
    const component = menus.find((f) => f.key === value.key).component;
    if (component) {
      setCurrentComponent(() => component);
      setIsMenu(false);
      setCurrentSelected(value.key);
    }
  };

  const MenuComponent = () => (
    <Menu
      items={menus}
      mode="inline"
      onClick={menuClick}
      selectedKeys={currentSelected}
      style={{
        fontWeight: 400,
        fontSize: 15,
      }}
    />
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!memberSettings) {
        // 3초 후 currentUser가 없다면 로그인 상태가 아니라고 판단
        setIsLoading(false);
        // 로그인 페이지에 머물도록 특별한 액션이 필요 없음
      }
    }, 3000);
    if (memberSettings?.companyName) {
      const promises = [clearTimeout(timer)];
      Promise.all(promises).then(() => {
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timer);
  }, [memberSettings]);

  useEffect(() => {
    if (isDesktopOrLaptop || isTablet) {
      // 데스크톱 또는 랩탑일 때의 컴포넌트
      setCurrentComponent(
        menus.find((f) => f.key === currentSelected)?.component
      );
      setIsMenu(false);
    } else if (isMobile || isPortrait) {
      // 태블릿 또는 모바일이고 세로 방향일 때의 컴포넌트
      setCurrentComponent(<MenuComponent />);
      setIsMenu(true);
    } else {
      // 그 외의 경우 (예: 모바일 가로 방향)
      setCurrentComponent(
        setCurrentComponent(
          menus.find((f) => f.key === currentSelected)?.component
        )
      );
    }
  }, [isDesktopOrLaptop, isTablet, isMobile, isPortrait]);

  return (
    <>
      {isLoading && (
        <div className="w-full h-screen flex justify-center items-center">
          <Spin />
        </div>
      )}
      {!isLoading && !memberSettings?.companyName && (
        <div className="w-full h-screen flex justify-center items-center">
          <Result
            status="error"
            title="회원정보 오류"
            subTitle={`회원정보를 불러오는데 문제가 발생했습니다. ${(
              <br />
            )}다시 한번 로그인 시도해주세요. ${(
              <br />
            )}문제가 계속 반복된다면 jbkim@jncore.com으로 이메일 부탁드립니다.`}
            extra={[
              <Button
                key="logout"
                onClick={() => {
                  logOut();
                }}
              >
                다시 로그인
              </Button>,
            ]}
          />
        </div>
      )}
      {!isLoading && (
        <div
          className="flex w-full h-full  rounded-lg"
          style={{
            backgroundColor: "#fff",
            minHeight: "100%",
          }}
        >
          <ConfigProvider
            theme={{
              token: {
                fontSize: 14,
                fontFamily: `"Nanum Gothic", "Nanum Gothic Coding", "Nanum Myeongjo", "Apple SD Gothic", sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
              },
              components: {
                Form: {
                  itemMarginBottom: 15,
                  labelFontSize: 14,
                  verticalLabelPadding: 2,
                },
                Input: { inputFontSize: 13 },
                Drawer: { paddingLG: 0 },
                Menu: {
                  iconSize: 20,
                  activeBarBorderWidth: 0,
                  itemBg: "#fff",
                  itemColor: "#2b2b2b",
                  itemHoverBg: "#71baff",
                  itemHoverColor: "#fff",
                  subMenuItemBg: "#ffffff",
                  itemSelectedBg: "#71baff",
                  itemSelectedColor: "#fff",
                },
              },
            }}
          >
            <Row
              gutter={8}
              className={!isMobile || !isPortrait ? "flex w-full" : "hidden"}
            >
              <Col span={6} style={{ borderRight: "2px solid #ececec" }}>
                <Row>
                  <Col span={24}>
                    <div className="flex w-full items-center h-auto ">
                      <Space className="w-1/2">
                        <ContentTitle title="환경설정" />
                      </Space>
                      {/* <Space className="w-1/2 flex justify-end">
                        <span>자동저장</span>
                        <Switch
                          size="small"
                          checked={memberSettings.isSettingAutoSave}
                          onChange={(value) => {
                            setMemberSettings(() => ({
                              ...memberSettings,
                              isSettingAutoSave: value,
                            }));
                            onUpdate(
                              memberSettings.id,
                              {
                                ...memberSettings,
                                isSettingAutoSave: value,
                              },
                              false
                            );
                          }}
                        />
                      </Space> */}
                    </div>
                    <div className="flex">
                      <MenuComponent />
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span={18}>
                <Row>
                  <Col span={24} className="p-5">
                    {currentComponent}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row
              gutter={0}
              className={isMobile && isPortrait ? "flex w-full" : "hidden"}
            >
              <Col span={24}>
                <div className={isMenu ? "hidden" : "flex w-full p-5"}>
                  <Button
                    onClick={() => {
                      setIsMenu(true);
                      setCurrentComponent(<MenuComponent />);
                    }}
                  >
                    뒤로가기
                  </Button>
                </div>
                <div className="flex w-full p-5">{currentComponent}</div>
              </Col>
            </Row>
          </ConfigProvider>
        </div>
      )}
      {contextHolder}{" "}
    </>
  );
};

export default ServiceSetting;
