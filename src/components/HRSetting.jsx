import { Card, Col, Collapse, Dropdown, List, Menu, Row, Table } from "antd";
import React, { useContext, useEffect, useMemo } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { IoApps } from "react-icons/io5";
import {
  EditOutlined,
  FolderAddOutlined,
  EllipsisOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { RiDeleteBin5Line } from "react-icons/ri";

const HRSetting = ({ onUpdate }) => {
  const { memberSettings } = useContext(CurrentLoginContext);

  const drawHeaderItem = (title) => {
    return [
      {
        key: "0",
        icon: <FolderAddOutlined />,
        label: <span className="text-xs">{title}</span>,
      },
    ];
  };

  const drawRowItem = (value, index, list) => {
    return [
      {
        key: "0",
        icon: <EditOutlined />,
        label: (
          <span className="text-xs">{`${value?.label || value} 수정`}</span>
        ),
      },
      {
        key: "1",
        icon: <RiDeleteBin5Line />,
        label: (
          <span className="text-xs">{`${value?.label || value} 삭제`}</span>
        ),
      },
    ];
  };

  // 공통 컬럼 구조를 생성하는 함수 정의
  const createColumns = (title, dataIndex, addItemText) => [
    { key: 1, dataIndex: dataIndex, width: "80%" },
    {
      key: 2,
      // title: (
      //   <Dropdown overlay={<Menu items={drawHeaderItem(`${addItemText}`)} />}>
      //     <div className="flex w-full justify-center items-center">
      //       <a onClick={(e) => e.preventDefault()}>
      //         <IoApps style={{ fontSize: "20px" }} />
      //       </a>
      //     </div>
      //   </Dropdown>
      // ),
      dataIndex: "action",
    },
  ];

  // 각 컬럼 배열을 생성
  const spotColumn = createColumns("직급", "label", "직급추가");
  const rankColumn = createColumns("직위", "label", "직위추가");
  const departmentColumn = createColumns("부서", "label", "부서추가");
  const jobsColumn = createColumns("계약", "label", "계약추가");
  const statusColumn = createColumns("상태", "label", "상태추가");

  const filteredHRs = useMemo(() => {
    const newUserSpot = [...memberSettings.userSpot];
    const newUserRank = [...memberSettings.userRank];
    const newUserDepartment = [...memberSettings.userDepartment];
    const newUserContract = [...memberSettings.userContract];
    const newUserStatus = [...memberSettings.userStatus];

    const dataArrays = [
      { key: "userSpot", value: newUserSpot },
      { key: "userRank", value: newUserRank },
      { key: "userDepartment", value: newUserDepartment },
      { key: "userContract", value: newUserContract },
      { key: "userStatus", value: newUserStatus },
    ];

    const checkedData = dataArrays.reduce((acc, { key, value }) => {
      if (value.length > 0) {
        const addedAction = value.map((item) => ({
          ...item,
          title: item.name,
          action: (
            <div className="flex w-full justify-center items-center">
              <Dropdown overlay={<Menu items={drawRowItem(item)} />}>
                <a onClick={(e) => e.preventDefault()}>
                  <EllipsisOutlined style={{ fontSize: "20px" }} />
                </a>
              </Dropdown>
            </div>
          ),
        }));
        acc[key] = addedAction;
      }
      return acc;
    }, {});

    return checkedData;
  }, [memberSettings]);

  // 공통 Dropdown 생성 함수
  const createExtra = (menuLabel) => (
    <Dropdown overlay={<Menu items={drawHeaderItem(menuLabel)} />}>
      <div className="flex w-full justify-center items-center">
        <a onClick={(e) => e.preventDefault()}>
          <MoreOutlined style={{ fontSize: "20px" }} />
        </a>
      </div>
    </Dropdown>
  );

  // 공통 List 생성 함수
  const createChildren = (dataSource) => (
    <List
      dataSource={dataSource}
      renderItem={(item) => (
        <List.Item
          className="px-5"
          actions={item.action ? [item.action] : undefined}
        >
          {item.label}
        </List.Item>
      )}
    />
  );

  const items = [
    {
      key: "1",
      label: "직위",
      extra: createExtra("직위추가"),
      children: createChildren(filteredHRs.userSpot),
    },
    {
      key: "2",
      label: "직급",
      extra: createExtra("직급추가"),
      children: createChildren(filteredHRs.userRank),
    },
    {
      key: "3",
      label: "부서",
      extra: createExtra("부서추가"),
      children: createChildren(filteredHRs.userDepartment),
    },
    {
      key: "4",
      label: "계약",
      extra: createExtra("계약추가"),
      children: createChildren(filteredHRs.userContract),
    },
    {
      key: "5",
      label: "상태",
      extra: createExtra("상태추가"),
      children: createChildren(filteredHRs.userStatus),
    },
  ];
  return (
    <Row gutter={[12, 12]} className="w-full">
      <Col span={24}>
        <Collapse size="small" items={items}></Collapse>
      </Col>
    </Row>
  );
};

export default HRSetting;
