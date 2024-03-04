import React, { useContext, useEffect, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { Empty, Table } from "antd";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { where } from "firebase/firestore";

const ListUser = () => {
  const [userList, setUserList] = useState([]);
  const { memberSettings } = useContext(CurrentLoginContext);
  const userQuery = useFirestoreQuery();

  const tableColumns = [
    {
      title: "사번",
      dataIndex: "userCompanyID",
      key: "userIdNumber",
    },
    {
      title: "이름",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "사내번호",
      dataIndex: "userCompanyPhoneNumber",
      key: "userPhoneNumber",
    },
    {
      title: "휴대전화",
      dataIndex: "userMobileNumber",
      key: "userMobileNumber",
    },
    {
      title: "이메일",
      dataIndex: "userEmail",
      key: "userEmail",
    },
    {
      title: "부서명",
      dataIndex: "userDepartment",
      key: "userDepartment",
    },
    {
      title: "직위",
      dataIndex: "userSpot",
      key: "userSpot",
    },
    {
      title: "직급",
      dataIndex: "userRank",
      key: "userRank",
    },
    {
      title: "입사일자",
      dataIndex: "userEnteringDate",
      key: "userEnteringDate",
    },
  ];

  const formatDatesInArray = (data) => {
    return data.map((item) => {
      // Firestore Timestamp에서 JavaScript Date 객체로 변환
      const userEnteringDate = item.userEnteringDate
        ? new Date(item.userEnteringDate.seconds * 1000)
            .toISOString()
            .split("T")[0]
        : "";

      const createdAt = item.createdAt
        ? new Date(item.createdAt.seconds * 1000).toISOString().split("T")[0]
        : "";

      // 기존 객체에 변환된 날짜를 추가
      return {
        ...item,
        userEnteringDate,
        createdAt,
      };
    });
  };

  const fetchUser = async () => {
    console.log(memberSettings);
    const condition = [where[("userOwner", "==", memberSettings.userID)]];
    try {
      await userQuery.getDocuments("users", (data) => {
        setUserList(() => formatDatesInArray(data));
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex w-full justify-center items-start">
      {userList.length > 0 ? (
        <Table
          columns={tableColumns}
          dataSource={userList}
          className="w-full"
        />
      ) : (
        <Empty description="표시할 데이터가 없습니다." />
      )}
    </div>
  );
};

export default ListUser;
