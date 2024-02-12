import { Button, Layout, Menu, Spin, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
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
          console.log(data);
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
            setMemberInfo(() => ({ ...fetchedMember }));
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
    console.log(memberInfo, memberSetting);
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
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className=" bg-white hidden lg:inline"
            theme="light"
          >
            <MainSide />
          </Sider>
          <Layout>
            <Header style={{ backgroundColor: colorBgContainer }}>
              {loginInfo?.email}
              {memberInfo?.companyName}
              <Button
                onClick={() => {
                  logOut();
                }}
              >
                로그아웃
              </Button>
            </Header>
            <Content
              style={{
                margin: "24px 16px",
                minHeight: 280,
              }}
              className=" rounded-lg"
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
