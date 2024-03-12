import React, { useContext, useState } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin.jsx";
import { where } from "firebase/firestore";
import { useEffect } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore.js";
import {
  ConvertDateByArray,
  ConvertPhoneNumberByArray,
  FilterKeyByArray,
  setColumnItem,
  setMenuItem,
} from "../utils/Index.js";
import { highlightText } from "../functions.js";
import { FilterBar } from "../share/Index.js";
import { TableWithFilterAndSearch } from "../widget/Index.js";
import { Col, Dropdown, Menu } from "antd";
import { GrMultiple } from "react-icons/gr";
import { FiPrinter } from "react-icons/fi";
import { MdMoreVert, MdOutlineViewCompactAlt } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import PageContainer from "../layout/PageContainer.jsx";
import { useLocation } from "react-router";
import { navigateMenus } from "../navigate.js";
const ListUser = () => {
  const { memberSettings, media } = useContext(CurrentLoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const userQuery = useFirestoreQuery();
  const location = useLocation();

  const setSections = (label, dataIndex, list) => {
    return { title: label, param: dataIndex, list: list };
  };

  const setActionColumnItem = () => {
    return {
      key: "action",
      title: (
        <div className="flex w-full justify-center items-center">
          <Dropdown
            overlay={
              <Menu
                items={[
                  setMenuItem(
                    selectedRowKeys.length > 0 ? false : true,
                    "모아보기",
                    <GrMultiple className="text-base" />,
                    1,
                    (value) => {
                      console.log(value);
                    },
                    selectedRowKeys
                  ),
                  setMenuItem(
                    selectedRowKeys.length > 0 ? false : true,
                    "선택삭제",
                    <FaRegTrashAlt className="text-base" />,
                    2,
                    (value) => {
                      console.log(value);
                    },
                    selectedRowKeys
                  ),
                ]}
              />
            }
          >
            <a onClick={(e) => e.preventDefault()}>
              <MdMoreVert
                className="text-gray-600"
                style={{ fontSize: "20px", fontWeight: 200 }}
              />
            </a>
          </Dropdown>
        </div>
      ),
      className: "text-xs",
      render: (_, record) =>
        selectedRowKeys?.length === 0 && (
          <div className="w-full flex justify-center items-center">
            <Dropdown
              overlay={
                <Menu
                  items={[
                    setMenuItem(
                      false,
                      "간략히보기",
                      <MdOutlineViewCompactAlt className="text-base" />,
                      1,
                      (value) => {
                        console.log(value);
                      },
                      record
                    ),
                    setMenuItem(
                      true,
                      "구성원수정",
                      <CiEdit className="text-base" />,
                      2,
                      (value) => {
                        console.log(value);
                      },
                      record
                    ),
                  ]}
                />
              }
            >
              <a onClick={(e) => e.preventDefault()}>
                <MdMoreVert
                  className="text-gray-600"
                  style={{ fontSize: "20px", fontWeight: 200 }}
                />
              </a>
            </Dropdown>
          </div>
        ),
    };
  };

  const fetchUser = async (id) => {
    const condition = [where[("userOwner", "==", id)]];
    const filterKeys = ["userDepartment", "userContract", "userStatus"];
    const phoneNumberKeys = ["userCompanyPhoneNumber", "userMobileNumber"];
    try {
      await userQuery.getDocuments(
        "users",
        (data) => {
          const convertDate = [...ConvertDateByArray(data)];
          const convertPhoneNumber = [
            ...ConvertPhoneNumberByArray(convertDate, phoneNumberKeys),
          ];
          //console.log(convertPhoneNumber);
          setUserList(() => [...convertPhoneNumber]);
          setFilteredUserList(() => [...convertPhoneNumber]);

          const grouped = FilterKeyByArray(data, filterKeys);
          setFilterItems(() => [
            setSections("부서명", filterKeys[0], grouped.userDepartmentGrouped),
            setSections("계약종류", filterKeys[1], grouped.userContractGrouped),
            setSections("재직", filterKeys[2], grouped.userStatusGrouped),
          ]);
        },
        condition
      );
    } catch (error) {
      console.log(error);
    }
  };

  const userColumn = [
    setColumnItem("이름", "userName", searchKeyword),
    setColumnItem("부서", "userDepartment", searchKeyword),
    setColumnItem("직위", "userSpot", searchKeyword),
    setColumnItem("직급", "userRank", searchKeyword),
    setColumnItem("상태", "userStatus", searchKeyword),
    setColumnItem("이메일", "userEmail", searchKeyword),
    setColumnItem("휴대전화", "userMobileNumberConverted", searchKeyword),
    setColumnItem("회사전화", "userCompanyPhoneNumberConverted", searchKeyword),
    setActionColumnItem(),
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  useEffect(() => {
    if (memberSettings.userID) {
      fetchUser(memberSettings.userID);
    }
  }, [memberSettings]);

  useEffect(() => {
    if (location.pathname) {
      setIsLoading(false);
    }
  }, [location]);

  return (
    <PageContainer
      isLoading={isLoading}
      pathname={location?.pathname}
      title={navigateMenus.find((f) => f.link === location.pathname).label}
    >
      <Col span={24}>
        <div className="flex w-full h-full justify-start items-start flex-wrap flex-col">
          {filterItems?.length > 0 && (
            <FilterBar
              sections={filterItems}
              originData={userList}
              data={filteredUserList}
              setData={setFilteredUserList}
              setKeyword={setSearchKeyword}
            />
          )}
          <div className="flex w-full">
            <TableWithFilterAndSearch
              columns={userColumn}
              data={filteredUserList}
              rowSelection={rowSelection}
              rowKey="id"
              size="small"
            />
          </div>
        </div>
      </Col>
    </PageContainer>
  );
};

export default ListUser;
