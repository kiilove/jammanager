import React from "react";
import { PiUsersFourFill } from "react-icons/pi";
import { FaTreeCity } from "react-icons/fa6";
import { RiCalendarTodoFill } from "react-icons/ri";
export const sideMenuItems = [
  {
    key: "2",
    labelKey: "menuHead2",
    icon: <FaTreeCity />,
    children: [
      {
        key: "2-1",
        labelKey: "menuHead2Sub1",
        link: "/eff179b5-a575-4046-99f3-ca0dc465af3e",
      },
      { key: "2-2", labelKey: "menuHead2Sub2", link: "/sowinglist" },
      { key: "2-3", labelKey: "menuHead2Sub3", link: "/blocklist" },
    ],
  },
  { key: "3", labelKey: "menuHead3", icon: <RiCalendarTodoFill /> },
];
