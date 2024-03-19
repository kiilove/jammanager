import {
  AutoComplete,
  DatePicker,
  Form,
  Input,
  Segmented,
  Select,
  Space,
  Switch,
  message,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import { CurrentLoginContext } from "../context/CurrentLogin";
import {
  MdMailOutline,
  MdOutlinePhone,
  MdOutlinePhoneIphone,
} from "react-icons/md";
import { formatPhoneNumber } from "../functions";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";

const AddAssignment = () => {
  const [userList, setUserList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [currentAssignmentType, setCurrentAssignmentType] =
    useState("개인배정");
  const [currentUser, setCurrentUser] = useState({});
  const [currentLocation, setCurrentLocation] = useState({});
  const [currentIsReturnDate, setCurrentIsReturnDate] = useState(true);
  const [currentReturnDate, setCurrentReturnDate] = useState("");
  const [currentReturnDateConverted, setCurrentReturnDateConverted] =
    useState("미지정");
  const [searchKeyword, setSearchKeyword] = useState("");
  const { memberSettings, grouped } = useContext(CurrentLoginContext);

  const userQuery = useFirestoreQuery();
  const assignmentQuery = useFirestoreQuery();

  const reduceUserOptions = (data = []) => {
    const newData = [...data];
    const options = newData.map((item, idx) => {
      const {
        userName,
        userEmail,
        userDepartment,
        userRank,
        userSpot,
        userCompanyPhoneNumber,
        userMobileNumber,
        userUID,
      } = item;

      const user = {
        key: idx,
        label: (
          <div className="flex flex-col" style={{ width: 400 }}>
            <div className="flex w-full px-2 ">
              <div className="flex w-1/2">
                <span className="text-gray-800 font-semibold">{userName}</span>
              </div>
              <div
                className="flex w-1/2 text-gray-400"
                style={{ fontSize: 12 }}
              >
                <span>{userDepartment}/</span>
                <span>{userSpot}/</span>
                <span>{userRank}</span>
              </div>
            </div>
            <div
              className="flex w-full px-2 gap-x-3 text-gray-400"
              style={{ fontSize: 12 }}
            >
              <div className="flex justify-start items-center gap-x-1">
                <span>
                  <MdMailOutline />
                </span>
                <span>{userEmail}</span>
              </div>
            </div>
            <div
              className="flex w-full px-2 gap-x-3 text-gray-400"
              style={{ fontSize: 12 }}
            >
              <div className="flex justify-start items-center gap-x-1">
                <span>
                  <MdOutlinePhone />
                </span>
                <span>{formatPhoneNumber(userCompanyPhoneNumber)}</span>
              </div>
              <div className="flex justify-start items-center gap-x-1">
                <span>
                  <MdOutlinePhoneIphone />
                </span>
                <span>{formatPhoneNumber(userMobileNumber)}</span>
              </div>
            </div>
          </div>
        ),
        value: userUID,
      };
      return user;
    });
    console.log(options);
    setUserOptions([...options]);
  };

  const currentUserStateUpdate = (UID, list, setList) => {
    const findUser = list.find((f) => f.userUID === UID);

    if (findUser) {
      setList(() => ({ ...findUser }));
    }
  };

  const isDateObject = (obj) => {
    return (
      obj && typeof obj === "object" && "seconds" in obj && "nanoseconds" in obj
    );
  };

  const deepSearchObject = (obj, keyword) => {
    if (obj === null || obj === undefined) {
      return false;
    }
    if (typeof obj === "string") {
      return obj.toLowerCase().includes(keyword.toLowerCase());
    }
    if (typeof obj === "object" && !isDateObject(obj)) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (deepSearchObject(obj[key], keyword)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const filterUser = (keyword) => {
    const originData = [...userList];
    const filtered = originData.filter((item) =>
      deepSearchObject(item, keyword)
    );
    setFilteredUserList(() => [...filtered]);
  };

  const fetchUser = async (id) => {
    if (!id) {
      message.error("불러오기 실패");
      return;
    }

    const condition = [where("userOwner", "==", id)];
    try {
      await userQuery.getDocuments(
        "users",
        (data) => {
          if (data?.length === 0) {
            message.info("구성원이 없습니다. 구성원을 먼저 추가해주세요.");
          }
          setUserList([...data]);
          setFilteredUserList([...data]);
          reduceUserOptions(data);
        },
        condition
      );
    } catch (error) {}
  };

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  useEffect(() => {
    reduceUserOptions(filteredUserList);
    console.log(filteredUserList);
  }, [filteredUserList]);

  useEffect(() => {
    if (memberSettings?.userID) {
      fetchUser(memberSettings.userID);
    }
  }, [memberSettings]);

  return (
    <Form
      labelCol={{
        span: 4,
      }}
      colon={false}
      style={{
        width: "100%",
      }}
      labelAlign="left"
    >
      <Form.Item label="배정형태">
        <Segmented
          onChange={(value) => setCurrentAssignmentType(value)}
          options={[
            { key: "개인배정", label: "개인배정", value: "개인배정" },
            { key: "공용배정", label: "공용배정", value: "공용배정" },
          ]}
        />
      </Form.Item>
      {currentAssignmentType === "개인배정" && (
        <Form.Item label="사용자">
          <AutoComplete
            options={[...userOptions]}
            onChange={(value) =>
              currentUserStateUpdate(value, userList, setCurrentUser)
            }
            value={currentUser?.userName}
          >
            <Input.Search
              onChange={(e) => {
                setCurrentUser({ userName: e.target.value });
                filterUser(e.target.value);
              }}
            />
          </AutoComplete>
        </Form.Item>
      )}
      {currentAssignmentType === "공용배정" && (
        <Form.Item label="사용장소">
          <AutoComplete options={[...grouped.groupedLocation]}>
            <Input.Search />
          </AutoComplete>
        </Form.Item>
      )}
      <Form.Item label="회수일자지정">
        <Space size="large">
          <Switch
            checked={currentIsReturnDate}
            onChange={(value) => setCurrentIsReturnDate(value)}
          />
          {currentIsReturnDate && <DatePicker locale={locale} />}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddAssignment;
