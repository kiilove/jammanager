import React from "react";
import { RiBookletLine } from "react-icons/ri";
import { LuUsers } from "react-icons/lu";
import { TbReportAnalytics } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { ConfigProvider, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import Logo1 from "../assets/logo/jam_blank.png";

const MainSide = () => {
  const navigate = useNavigate();
  function getItem(label, key, link, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      link,
      type,
    };
  }
  const menus = [
    getItem("자산관리", "title1", undefined, <RiBookletLine />, [
      getItem("자산등록", "sub1", "/eff179b5-a575-4046-99f3-ca0dc465af3e"),
      getItem("자산목록", "sub2", "/ed4599ce-5808-462c-b10f-3eee0df54dd1"),
    ]),
    getItem("구성원관리", "title2", undefined, <LuUsers />, [
      getItem("구성원등록", "sub3", "/0f55998a-7b77-426d-880d-3c6fd7ef4654"),
      getItem("구성원목록", "sub4", "/a7e05d80-6fa2-452c-b3c7-f4177fad2534"),
    ]),
    getItem(
      "보고서",
      "title3",
      "/03fba64a-09a4-43bd-9d3e-34adadf3527d",
      <TbReportAnalytics />
    ),
    getItem(
      "환경설정",
      "title4",
      "/f8119f14-43bf-4b3b-906a-ed77be4bab3c",
      <IoSettingsOutline />
    ),
  ];

  const menuClick = (value) => {
    //const link = menus.find((f) => f.key === value.key).link;
    const checkLink = menus.find((f) => f.key === value.key);
    if (checkLink?.link !== undefined) {
      const link = menus.find((f) => f.key === value.key).link;
      console.log(link);
      navigate(link);
    } else {
      const parentsKey = value?.keyPath[value.keyPath.length - 1];

      const parentsIndex = menus.findIndex((f) => f.key === parentsKey);
      const menuLink = menus[parentsIndex]?.children.find(
        (f) => f.key === value.key
      ).link;

      navigate(menuLink);
    }
  };
  return (
    <div className="w-full flex-col">
      <div className="flex justify-center items-center h-20">
        <img src={Logo1} alt="" style={{ width: "50px" }} />
      </div>

      <Menu items={menus} mode="inline" onClick={menuClick} theme="dark" />
    </div>
  );
};

export default MainSide;
