import { Menu } from "antd";
import React from "react";
import { RiBookletLine } from "react-icons/ri";
import CompanySetting from "./CompanySetting";

const SettingsMenu = ({ theme = "light" }) => {
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
      <RiBookletLine />,
      <CompanySetting />
    ),
  ];

  const menuClick = (value) => {
    //const link = menus.find((f) => f.key === value.key).link;
    const checkLink = menus.find((f) => f.key === value.key);
    if (checkLink?.link !== undefined) {
      const link = menus.find((f) => f.key === value.key).link;
    } else {
      const parentsKey = value?.keyPath[value.keyPath.length - 1];

      const parentsIndex = menus.findIndex((f) => f.key === parentsKey);
      const menuLink = menus[parentsIndex]?.children.find(
        (f) => f.key === value.key
      ).link;
    }
  };
  return (
    <div className="w-full flex-col ">
      <Menu
        items={menus}
        mode="inline"
        onClick={menuClick}
        theme={theme}
        style={{
          fontWeight: 400,
          fontSize: 15,
        }}
      />
    </div>
  );
};

export default SettingsMenu;
