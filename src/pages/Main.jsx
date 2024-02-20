import {
  Button,
  ConfigProvider,
  Drawer,
  Layout,
  Menu,
  Spin,
  theme,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Content, Header } from "antd/es/layout/layout";
import MainSide from "../components/MainSide";
import { CurrentLoginContext } from "../context/CurrentLogin";
import useFirebaseAuth from "../hooks/useFireAuth";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import { decryptObject } from "../functions";

const Main = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawer, setIsDrawer] = useState(false);
  const [memberInfo, setMemberInfo] = useState({});
  const [memberSetting, setMemberSetting] = useState({});
  const { loginInfo, setLoginInfo, memberSettings, setMemberSettings } =
    useContext(CurrentLoginContext);
  const { currentUser, logOut } = useFirebaseAuth();
  const membersQuery = useFirestoreQuery();
  const memberSettingQuery = useFirestoreQuery();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const fetchMemberSettingQuery = async (value) => {
    const condition = [where("userID", "==", value)];

    try {
      await memberSettingQuery.getDocuments(
        "memberSetting",
        (data) => {
          if (data.length > 0) {
            setMemberSetting({ ...data[0] });
          }
        },
        condition
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMembersQuery = async (value) => {
    const condition = [where("userID", "==", value)];
    try {
      await membersQuery.getDocuments(
        "members",
        (data) => {
          if (data.length > 0) {
            const decryptObj = {
              companyExtraAddress: data[0].companyExtraAddress,
              companyFullAddress: data[0].companyFullAddress,
              companyName: data[0].companyName,
              companyTel: data[0].companyTel,
              companyTelExtra: data[0].companyTelExtra,
              companyZoneCode: data[0].companyZoneCode,
            };
            const fetchedMember = {
              ...decryptObject(decryptObj, process.env.REACT_APP_SECRET_KEY),
            };
            const filteredMember = {
              companyName: fetchedMember.companyName,
              userEmail: fetchedMember.userEmail,
              userID: fetchedMember.userID,
            };
            setMemberInfo(() => ({ ...filteredMember }));
          }
        },
        condition
      );
    } catch (error) {
      console.log(error);
    }
  };

  // 로그인 정보를 체크하는 useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      // 2초 후에 실행될 로직
      if (!currentUser) {
        // 로그인 정보가 없으면 로그인 페이지로 리디렉션
        navigate("/login");
      }
    }, 2000);
    if (currentUser) {
      //console.log(currentUser);
      const promises = [
        setLoginInfo(currentUser),
        fetchMembersQuery(currentUser.uid),
        fetchMemberSettingQuery(currentUser.uid),
        clearTimeout(timer),
      ];
      Promise.all(promises).then(() => {
        setIsLoading(false);
      });
    }

    // 컴포넌트 언마운트 시 타이머 제거
    return () => clearTimeout(timer);
  }, [currentUser]);

  useEffect(() => {
    if (memberSetting) {
      setMemberSettings(() => ({ ...memberSetting }));
    }
  }, [memberInfo, memberSetting]);

  return (
    <>
      {isLoading && (
        <div className="w-full h-screen flex justify-center items-center">
          <Spin />
        </div>
      )}
      {!isLoading && (
        <Layout className="p-0 ">
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className="hidden lg:inline bg-transparent "
            style={{ backgroundColor: "#005c8a" }}
          >
            <MainSide />
          </Sider>
          <Layout>
            <Header style={{ backgroundColor: colorBgContainer, padding: 0 }}>
              <div className="flex lg:hidden w-full h-full justify-start items-center px-2">
                <Button
                  icon={<GiHamburgerMenu style={{ fontSize: "20px" }} />}
                  className="flex justify-center items-center"
                  style={{ width: "45px", height: "45px" }}
                  onClick={() => setIsDrawer(true)}
                />
              </div>
              <div className="hidden lg:flex h-full w-full justify-end items-center gap-x-2">
                {loginInfo?.email}
                {memberInfo?.companyName}
                <Button
                  onClick={() => {
                    logOut();
                  }}
                >
                  로그아웃
                </Button>
              </div>
              <Drawer
                open={isDrawer}
                onClose={() => setIsDrawer(false)}
                placement="left"
                styles={{
                  header: {
                    borderBottom: `1px solid #424242`,
                    padding: 16,
                  },
                }}
              >
                <MainSide
                  theme="light"
                  setDrawer={setIsDrawer}
                  isDrawer={true}
                />
              </Drawer>
            </Header>
            <Content
              style={{
                minHeight: 280,
              }}
              className="mt-1 lg:rounded-lg lg:m-1"
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};

export default Main;
