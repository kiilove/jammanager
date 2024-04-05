import { Avatar, ConfigProvider, List, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegImage } from "react-icons/fa6";

export const ListWithFilterAndSearch = ({
  originalData = [],
  listItem = [],
  size = "small",
}) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  return (
    <ConfigProvider
      theme={{
        components: {},
      }}
    >
      <List
        size={size}
        bordered
        dataSource={originalData}
        className="w-full bg-white "
        renderItem={(item, idx) => {
          const title = (
            <span
              className="font-semibold underline cursor-pointer"
              onClick={() => {
                navigate("/8e4314e1-ec72-47b5-84e2-114a5e7a697a", {
                  state: { data: item },
                });
              }}
            >
              {item[listItem[0]]}
            </span>
          );
          let avatar = "";
          if (item[listItem[1]]?.length > 0) {
            const sorted = item[listItem[1]].sort((a, b) =>
              b.createdAtConverted.localeCompare(a.createdAtConverted)
            );
            avatar = sorted[0].url;
          } else {
            if (item[listItem[2]]?.length > 0) {
              avatar = item[listItem[2]].url;
            }
          }
          const description = (
            <div className="w-full h-auto flex flex-col justify-start items-start text-gray-600">
              <div className="flex w-full flex-wrap">
                <span>일련번호:</span>
                <span>{item[listItem[3]]}</span>
              </div>
              <div className="flex w-full">
                <span>위치:</span>
                <span>{item[listItem[4]]}</span>
              </div>
              <div className="flex w-full">
                <span>사용자:</span>
                <span>{item[listItem[5]]}</span>
              </div>
            </div>
          );

          return (
            <List.Item>
              <List.Item.Meta
                avatar={
                  avatar === "" ? (
                    <Avatar
                      icon={<FaRegImage />}
                      size={64}
                      shape="square"
                      className="flex justify-center items-center"
                    />
                  ) : (
                    <Avatar src={avatar} size={64} shape="square" />
                  )
                }
                title={title}
                description={description}
              />
            </List.Item>
          );
        }}
      />
    </ConfigProvider>
  );
};
