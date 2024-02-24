import { Card, Col, Dropdown, Menu, Row, Table } from "antd";
import React, { useContext, useEffect, useMemo } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { IoApps } from "react-icons/io5";
import {
  EditOutlined,
  FolderAddOutlined,
  EllipsisOutlined,
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
    { key: 1, title: title, dataIndex: dataIndex, width: "80%" },
    {
      key: 2,
      title: (
        <Dropdown overlay={<Menu items={drawHeaderItem(`${addItemText}`)} />}>
          <div className="flex w-full justify-center items-center">
            <a onClick={(e) => e.preventDefault()}>
              <IoApps style={{ fontSize: "20px" }} />
            </a>
          </div>
        </Dropdown>
      ),
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

  return (
    <Row gutter={[12, 12]}>
      <Col span={8}>
        <Table
          size="small"
          columns={spotColumn}
          dataSource={filteredHRs.userSpot}
          pagination={false}
        />
      </Col>
      <Col span={8}>
        <Table
          size="small"
          columns={rankColumn}
          dataSource={filteredHRs.userRank}
          pagination={false}
        />
      </Col>
      <Col span={8}>
        <Table
          size="small"
          columns={departmentColumn}
          dataSource={filteredHRs.userDepartment}
          pagination={false}
        />
      </Col>

      <Col span={8}>
        <Table
          size="small"
          columns={jobsColumn}
          dataSource={filteredHRs.userContract}
          pagination={false}
        />
      </Col>
      <Col span={8}>
        <Table
          size="small"
          columns={statusColumn}
          dataSource={filteredHRs.userStatus}
          pagination={false}
        />
      </Col>
    </Row>
  );
};

export default HRSetting;
