import React, { useState } from "react";
import {
  PictureOutlined,
  VideoCameraOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { LiaPhotoVideoSolid } from "react-icons/lia";
import { Button, Card, Modal, Segmented, Space } from "antd";
const iconBoxSize = { width: 45, height: 45 };
const iconFontSize = { fontSize: 20 };
export const FeedActionBar = ({
  actions,
  setActions,
  feedType,
  setFeedType,
  attached,
}) => {
  return (
    <div className="w-full flex justify-start items-center border rounded p-2 border-gray-200">
      <Space>
        <button
          className={`flex justify-center items-center rounded ${
            actions.medias ? "bg-green-100" : "bg-white"
          }`}
          style={iconBoxSize}
          onClick={() => {
            if (!attached) {
              setActions(() => ({ ...actions, medias: !actions.medias }));
            }
          }}
        >
          <LiaPhotoVideoSolid
            style={iconFontSize}
            className={actions.medias ? "text-green-800" : "text-gray-500"}
          />
        </button>

        <Segmented
          defaultValue="일반"
          options={["일반", "수리", "반납"]}
          onChange={(value) => setFeedType(value)}
        />
      </Space>
    </div>
  );
};
