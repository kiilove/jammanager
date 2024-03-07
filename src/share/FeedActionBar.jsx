import React, { useState } from "react";
import {
  PictureOutlined,
  VideoCameraOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Button, Card, Segmented, Space } from "antd";
const iconBoxSize = { width: 45, height: 45 };
const iconFontSize = { fontSize: 20 };
export const FeedActionBar = ({ actions, setActions }) => {
  return (
    <div className="w-full flex justify-start items-center border rounded p-2 border-gray-200">
      <Space>
        <button
          className={`flex justify-center items-center rounded ${
            actions.pic ? "bg-green-100" : "bg-white"
          }`}
          style={iconBoxSize}
          onClick={() => setActions(() => ({ ...actions, pic: !actions.pic }))}
        >
          <PictureOutlined
            style={iconFontSize}
            className={actions.pic ? "text-green-800" : "text-gray-500"}
          />
        </button>
        <button
          className={`flex justify-center items-center rounded ${
            actions.video ? "bg-red-100" : "bg-white"
          }`}
          style={iconBoxSize}
          onClick={() =>
            setActions(() => ({ ...actions, video: !actions.video }))
          }
        >
          <VideoCameraOutlined
            style={iconFontSize}
            className={actions.video ? "text-red-800" : "text-gray-500"}
          />
        </button>

        <Segmented defaultValue="일반" options={["일반", "수리", "반납"]} />
      </Space>
    </div>
  );
};
