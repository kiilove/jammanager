import {
  AutoComplete,
  Col,
  Collapse,
  ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  List,
  Row,
  Space,
  Switch,
  Typography,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { ContentTitle } from "../commonstyles/Title";
import {
  useFirestoreAddData,
  useFirestoreQuery,
  useFirestoreUpdateData,
} from "../hooks/useFirestore";
import { Timestamp, where } from "firebase/firestore";
import {
  convertTimestampToDate,
  formatPhoneNumber,
  makeFeedObject,
} from "../functions";
import { useMediaQuery } from "react-responsive";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";

const AssetAssignment = ({ data, setClose }) => {
  const [currentAssetPic, setCurrentAssetPic] = useState();
  const [currentLocation, setCurrentLocation] = useState("");
  const [currentUserInfo, setCurrentUserInfo] = useState({});
  const [currentAssetReturnDate, setCurrentAssetReturnDate] = useState(
    dayjs(new Date())
  );
  const [assetAssignDate, setAssetAssignDate] = useState(dayjs(new Date()));

  const [isReturnDate, setIsReturnDate] = useState(false);
  const [assetPicList, setAssetPicList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    apiType,
    title,
    message,
    placement,
    duration,
    maxCount
  ) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
      maxCount,
    });
  };
  const [assignForm] = Form.useForm();
  const [assignExtraForm] = Form.useForm();
  const userQuery = useFirestoreQuery();
  const assetUpdate = useFirestoreUpdateData();
  const assetFeedAdd = useFirestoreAddData();

  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1223px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  const makeUserLabelValueData = (options) => {
    const newOptions = [...options];
    let lableValue = [];
    if (newOptions.length > 0) {
      lableValue = newOptions.map((option, oIdx) => {
        const newValue = option.userUID;
        const newLabel = (
          <div className="w-full flex flex-col">
            <div className="flex w-full gap-x-2">
              <span>{option.userName}</span>
              <span>{option.userSpot}</span>
              <span>{option.userRank}</span>
              <span>{option.userEmail}</span>
            </div>
          </div>
        );
        return { value: newValue, label: newLabel };
      });
    }
    return lableValue;
  };

  const onUserSearch = (value) => {
    const filtered = userList.filter((f) => f.userName.includes(value));
    console.log(filtered);
    setUserOptions(filtered.length > 0 ? makeUserLabelValueData(filtered) : []);
  };

  const onSelectUser = (value) => {
    // 여기서 value는 선택된 사용자의 userUID입니다.
    // 필요한 로직을 추가하여 userUID를 사용하십시오.

    // 현재 선택된 사용자 정보를 설정
    const selectedUserInfo = userList.find((user) => user.userUID === value);

    setCurrentUserInfo(selectedUserInfo);
    // 선택된 사용자 이름을 Input에 표시
    assignForm.setFieldValue("assetAssign", "");
    setUserOptions([]);
  };

  const handleUpdateAssetAndFeed = async (data, userInfo, location) => {
    const assetAssingDate = Timestamp.fromDate(assetAssignDate.toDate());
    const assetAssingDateConverted = convertTimestampToDate(assetAssignDate);
    let assetReturnDate = "";
    let assetReturnDateConverted = "";

    if (isReturnDate) {
      assetReturnDate = Timestamp.fromDate(currentAssetReturnDate.toDate());
      assetReturnDateConverted = convertTimestampToDate(assetReturnDate);
    }

    const assetUpdatedValue = {
      ...data,
      userInfo: userInfo,
      location: location,
      assetAssignDate: Timestamp.fromDate(assetAssignDate.toDate()),
      isReturnDate: isReturnDate,
      assetReturnDate,
      assetReturnDateConverted,
    };
    console.log(assetUpdatedValue);
    // delete assetUpdatedValue.assetPurchasedDateConverted;
    // delete assetUpdatedValue.assetCreateAtConverted;

    const feedValue = makeFeedObject(
      data.id,
      data.assetUID,
      "system",
      Timestamp.fromDate(new Date()),
      assetUpdatedValue.assetAssignDate,
      "배정",
      `${userInfo.userName}에게 배정하였습니다.`,
      []
    );

    //console.log(feedValue);

    try {
      await assetUpdate.updateData(
        "assets",
        data.id,
        { ...assetUpdatedValue },
        async () => {
          console.log("updated asset");

          await assetFeedAdd.addData("assetFeeds", { ...feedValue }, () => {
            openNotification(
              "success",
              "업데이트 성공",
              `${data?.assetName}을 업데이트했습니다.`,
              "topRight",
              3,
              5
            );
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async (id) => {
    const condition = [where("userOwner", "==", id)];
    try {
      await userQuery.getDocuments(
        "users",
        (data) => {
          console.log(data);
          setUserList([...data]);
        },
        condition
      );
    } catch (error) {}
  };
  useEffect(() => {
    if (!data) {
      openNotification(
        "error",
        "데이터오류",
        "자산정보를 불러오지 못했습니다.",
        "top",
        3
      );
    } else {
      if (data?.firstPics?.length > 0) {
        setCurrentAssetPic(() => data.firstPics[0].url);
        const picUrls = data.firstPics.map((pic, pIdx) => {
          const { url } = pic;

          return url;
        });
        setAssetPicList(() => [...picUrls]);
      } else {
        setAssetPicList(() => []);
      }
      fetchUsers(data.assetOwner);
    }
  }, [data]);

  useEffect(() => {
    //setCurrentUserInfo({});
  }, []);

  useEffect(() => {
    console.log(assetUpdate.error);
  }, [assetUpdate.error]);

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Divider: {
              verticalMarginInline: 1,
            },
          },
        }}
      >
        <Row className={isMobile && "w-full"}>
          <Col span={24}>
            <ContentTitle title="자산배정" padding={0} marginBottom={5} />
          </Col>
          <Col span={12}>
            <Row justify="start" gutter={[0, 16]}>
              <Col span={24}>
                <div className="flex w-full h-full justify-center items-center ">
                  <Image.PreviewGroup items={[...assetPicList]}>
                    <Image
                      width={100}
                      src={currentAssetPic}
                      fallback="data:image/png;base64,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"
                      preview={true}
                    />
                  </Image.PreviewGroup>
                </div>
              </Col>

              <Col span={24}>
                <div className="flex gap-1">
                  {assetPicList.length > 0 &&
                    assetPicList.map((url, uIdx) => (
                      <>
                        <Image
                          src={url}
                          width={45}
                          preview={false}
                          key={uIdx}
                          className=" rounded-lg cursor-pointer"
                          style={{ border: "1px solid #dfdfdf", padding: 2 }}
                          onClick={() => setCurrentAssetPic(() => url)}
                        />
                      </>
                    ))}
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row justify={"start"}>
              <Col span={24}>
                <div
                  className="flex w-full h-full justify-start items-start flex-col text-gray-700 px-2 "
                  style={{ fontSize: "12px", fontWeight: 400 }}
                >
                  <div className="flex">
                    <span
                      style={{
                        fontSize: "17px",
                        color: "#000",
                        fontWeight: 600,
                      }}
                    >
                      {data.assetName}
                    </span>
                  </div>
                  <div className="flex">
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#747474",
                        fontWeight: 500,
                      }}
                    >
                      {data.assetCode}
                    </span>
                  </div>
                  <div
                    className="flex mb-2"
                    style={{
                      fontSize: "12px",
                      color: "#091b4b",
                      fontWeight: 600,
                    }}
                  >
                    <span>{data.assetCategory}/</span>
                    <span>{data.assetProductLine}</span>
                  </div>
                  <div className="flex">
                    <span className="mr-1">모델명:</span>
                    <span>{data.assetModel}</span>
                  </div>
                  <div className="flex">
                    <span className="mr-1">제조사:</span>
                    <span>{data.assetVendor}</span>
                  </div>
                  <div className="flex">
                    <span className="mr-1">소유:</span>
                    <span>{data.assetOwnerCompany}</span>
                  </div>
                  <div className="flex">
                    <span className="mr-1">취득일자:</span>
                    <span>{data.assetPurchasedDateConverted}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>{" "}
          <Divider />
          <List
            header={<div>구성품</div>}
            bordered
            dataSource={data.assetAccessory}
            renderItem={(item) => (
              <List.Item>
                품목:{item.name}, 수량:{item.count}
              </List.Item>
            )}
            size="small"
            className="w-full"
          />
          <Divider />
          <Form
            labelCol={{
              span: 6,
            }}
            style={{
              width: "100%",
            }}
            labelAlign="right"
            className="w-full"
            form={assignForm}
          >
            <Form.Item name="assetAssign" label="이름 검색">
              <AutoComplete
                onSearch={onUserSearch}
                onSelect={onSelectUser}
                options={userOptions}
                className="w-full"
              >
                <Input.Search />
              </AutoComplete>
            </Form.Item>
          </Form>
          {currentUserInfo?.userName !== undefined && (
            <div
              className="flex w-full h-full p-2 flex-col"
              style={{ border: "1px solid #e1e1e1", borderRadius: 5 }}
            >
              <div className="flex w-full">
                <div className="flex flex-col">
                  <div className="flex w-full gap-x-2">
                    <span className="text-gray-600">
                      {currentUserInfo?.userName}
                    </span>
                    <span className="text-gray-600">
                      {currentUserInfo?.userDepartment}
                    </span>
                    <span className="text-gray-600">
                      {`${currentUserInfo.userSpot}(${currentUserInfo?.userRank})`}
                    </span>
                  </div>
                  <div className="flex w-full gap-x-2">
                    <span className="text-gray-600">
                      {currentUserInfo?.userEmail}
                    </span>
                    <span className="text-gray-600">
                      {formatPhoneNumber(
                        currentUserInfo?.userCompanyPhoneNumber
                      ) || currentUserInfo?.userCompanyPhoneNumber}
                    </span>
                    <span className="text-gray-600">
                      {formatPhoneNumber(currentUserInfo?.userMobileNumber)}
                    </span>
                  </div>
                </div>
                <div className="flex"></div>
              </div>
            </div>
          )}
          <Divider />
          <Form
            labelCol={{
              span: 6,
            }}
            style={{
              width: "100%",
            }}
            labelAlign="right"
            form={assignExtraForm}
          >
            <Form.Item label="위치(장소)">
              <AutoComplete className="w-full">
                <Input.Search
                  placeholder="위치"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(() => e.target.value)}
                />
              </AutoComplete>
            </Form.Item>
            <Form.Item label="배정일자">
              <DatePicker
                locale={locale}
                value={assetAssignDate}
                defaultValue={dayjs(new Date())}
                onChange={(value) => setAssetAssignDate(value)}
              />
            </Form.Item>
            <Form.Item label="회수일자지정">
              <Space gutter={8}>
                <Form.Item name="assetIsReturn" noStyle>
                  <Switch
                    checked={isReturnDate}
                    onChange={(value) => setIsReturnDate(value)}
                  />
                </Form.Item>
                {isReturnDate && (
                  <Form.Item name="assetReturnDate" noStyle>
                    <DatePicker
                      locale={locale}
                      value={currentAssetReturnDate}
                      defaultValue={dayjs(new Date())}
                      onChange={(value) => setCurrentAssetReturnDate(value)}
                    />
                  </Form.Item>
                )}
              </Space>
            </Form.Item>
          </Form>
          <Divider />
          <div className="flex w-full" style={{ height: 30 }}>
            <button
              className={
                !currentUserInfo?.userName || currentLocation === ""
                  ? " bg-gray-300 w-full h-full rounded"
                  : " bg-gray-700 w-full h-full rounded"
              }
              disabled={!currentUserInfo?.userName || currentLocation === ""}
              onClick={() =>
                handleUpdateAssetAndFeed(data, currentUserInfo, currentLocation)
              }
            >
              <span className="text-gray-100" style={{ letterSpacing: "20px" }}>
                자산배정
              </span>
            </button>
          </div>
        </Row>
        {contextHolder}
      </ConfigProvider>
    </>
  );
};

export default AssetAssignment;
