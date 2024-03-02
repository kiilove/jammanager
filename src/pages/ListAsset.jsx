import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import Draggable from "react-draggable";
import {
  Button,
  Card,
  ConfigProvider,
  Descriptions,
  Dropdown,
  Empty,
  Image,
  Input,
  List,
  Menu,
  Modal,
  Table,
  Tag,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { FiPrinter } from "react-icons/fi";
import { GrMultiple } from "react-icons/gr";
import { IoReturnUpBack } from "react-icons/io5";
import {
  MdMoreHoriz,
  MdMoreVert,
  MdOutlineViewCompactAlt,
} from "react-icons/md";
import { GrOverview } from "react-icons/gr";
import { BiDetail } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { FaUserTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ContentTitle } from "../commonstyles/Title";
import { groupByKey, highlightText } from "../functions";
import dayjs from "dayjs";
import "./ListAsset.css";
import AssetView from "../components/AssetView";
import AssetAssignment from "../components/AssetAssignment";
import { CurrentLoginContext } from "../context/CurrentLogin";
import AssetFlex from "../components/AssetFlex";

const ListAsset = () => {
  const [assetList, setAssetList] = useState([]);
  const [assetMultiList, setAssetMultiList] = useState([]);
  const assetQuery = useFirestoreQuery();
  const [assetCategoryList, setAssetCategoryList] = useState([]);
  const [assetVendorList, setAssetVendorList] = useState([]);
  const [assetPurchaseNameList, setAssetPurchaseNameList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [userInfoList, setUserInfoList] = useState([]);
  const [searchParams, setSearchParams] = useState({
    assetCategory: [],
    assetVendor: [],
    assetPurchaseName: [],
    location: [],
    userInfo: [],
  });
  const [searchParamsList, setSearchParamsList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAssetAssignment, setIsAssetAssignment] = useState({
    visible: false,
    assetID: "",
  });
  const [dragDisabled, setDragDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const [modals, setModals] = useState([]);
  const [modalProp, setModalProp] = useState({
    open: false,
    data: null,
  });
  const [multiModalProp, setMultiModalProp] = useState({
    open: false,
    data: null,
  });

  const navigate = useNavigate();
  const draggleRef = useRef(null);
  const { media } = useContext(CurrentLoginContext);

  const handleViewDetail = (record) => {
    const newModal = {
      ...record, // 모달에 표시할 내용
    };
    setModals([...modals, newModal]);
  };

  const handleViewAssetDefined = (record) => {
    console.log(record);
    setIsAssetAssignment({
      visible: true,
      assetID: record.id,
      data: record,
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const drawHeaderMenu = () => {
    let menuArray = [
      {
        key: "2",
        index: 10,
        icon: <GrMultiple className="text-base" />,
        label: <span className="text-xs">모아보기</span>,
        onClick: () => {
          setMultiModalProp({ open: true, data: assetMultiList });
        },
      },
      {
        key: "3",
        index: 11,
        icon: <FiPrinter className="text-base" />,
        label: <span className="text-xs">자산코드인쇄</span>,
        onClick: () => {
          navigate("/261c956d-a9ce-4e22-aec2-8d9398b7af9b", {
            state: { data: assetMultiList },
          });
        },
      },
    ];
    return menuArray.sort((a, b) => a.index - b.index);
  };

  const drawMenu = (record) => {
    let menuArray = [
      {
        key: "2",
        index: 10,
        icon: <MdOutlineViewCompactAlt className="text-base" />,
        label: <span className="text-xs">간략히보기</span>,
        onClick: () => {
          setModalProp({ open: true, data: record });
        },
      },
      {
        key: "3",
        index: 11,
        icon: <CiEdit className="text-base" />,
        label: <span className="text-xs">자산수정</span>,
        onClick: () => {
          handleViewAssetDefined(record);
        },
      },
    ];

    if (record?.userInfo?.userName === "미지정") {
      menuArray.push({
        key: "1",
        index: 20,
        icon: <FaUserTag className="text-base" />,
        label: <span className="text-xs">사용자배정</span>,
        onClick: () => {
          handleViewAssetDefined(record);
        },
      });
    } else {
      menuArray.push({
        key: "1",
        index: 20,
        icon: <IoReturnUpBack className="text-base" />,
        label: <span className="text-xs">자산반납</span>,
        onClick: () => {
          handleViewAssetDefined(record);
        },
      });
    }
    return menuArray.sort((a, b) => a.index - b.index);
  };

  const tableColumns = [
    {
      title: "종류",
      dataIndex: "assetCategory",
      key: "assetCategory",
      className: "text-xs",
      showSorterTooltip: false,
      sorter: (a, b) => a.assetCategory.localeCompare(b.assetCategory),
      render: (text) => <>{highlightText(text, searchKeyword)}</>,
    },
    {
      title: "자산명",
      dataIndex: "assetName",
      key: "assetName",
      className: "text-xs",
      showSorterTooltip: false,
      sorter: (a, b) => a.assetName.localeCompare(b.assetName),
      render: (text, record) => (
        <button
          className="flex justify-start items-start flex-col"
          onClick={() => handleRowNavigate(record)}
        >
          <span>{highlightText(text, searchKeyword)}</span>
          <span style={{ fontSize: 11 }}>
            {highlightText(record.assetCode.toUpperCase(), searchKeyword)}
          </span>
        </button>
      ),
    },
    {
      title: "제조사",
      dataIndex: "assetVendor",
      key: "assetVendor",
      className: "text-xs",
      showSorterTooltip: false,
      sorter: (a, b) => a.assetVendor.localeCompare(b.assetVendor),
      render: (text) => <>{highlightText(text, searchKeyword)}</>,
    },
    {
      title: "모델명",
      dataIndex: "assetModel",
      key: "assetModel",
      className: "text-xs",
      showSorterTooltip: false,
      sorter: (a, b) => a.assetModel.localeCompare(b.assetModel),
      render: (text) => <>{highlightText(text, searchKeyword)}</>,
    },
    {
      title: "매입처",
      dataIndex: "assetPurchaseName",
      key: "assetPurchaseName",
      className: "text-xs",
      showSorterTooltip: false,
      sorter: (a, b) => a.assetName.localeCompare(b.assetName),
      render: (text) => <>{highlightText(text, searchKeyword)}</>,
    },
    {
      title: "구매일자",
      dataIndex: "assetPurchasedDateConverted",
      key: "assetPurchasedDateConverted",
      className: "text-xs",
      showSorterTooltip: false,
      sorter: (a, b) =>
        new Date(a.assetPurchasedDateConverted) -
        new Date(b.assetPurchasedDateConverted),
      render: (text) => <>{highlightText(text, searchKeyword)}</>,
    },
    {
      title: "등록일자",
      dataIndex: "createdAtConverted",
      key: "createdAtConverted",
      className: "text-xs",
      showSorterTooltip: false,
      sorter: (a, b) =>
        new Date(a.createdAtConverted) - new Date(b.createdAtConverted),
      render: (text) => <>{highlightText(text, searchKeyword)}</>,
    },
    {
      title: "사용일수(사용개월수)",
      key: "usageDaysMonths",
      className: "text-xs",
      showSorterTooltip: false,
      render: (_, record) => {
        const purchasedAt = dayjs(record.assetPurchasedDateConverted);
        const today = dayjs();
        const usageDays = today.diff(purchasedAt, "day");
        const usageMonths = today.diff(purchasedAt, "month");
        return `${usageDays.toLocaleString()}일 (${usageMonths.toLocaleString()}개월)`;
      },
    },
    {
      title: "자산위치",
      dataIndex: "location",
      key: "location",
      className: "text-xs",
      showSorterTooltip: false,
      render: (text) => <>{highlightText(text, searchKeyword)}</>,
    },
    {
      title: "사용자",
      dataIndex: "userInfo",
      key: "userInfo",
      className: "text-xs",
      showSorterTooltip: false,
      render: (userInfo) => {
        let color = "blue";
        switch (userInfo?.userName) {
          case "폐기":
            color = "volcano";
            break;
          case "미지정":
            color = "magenta";

          default:
            break;
        }

        return (
          <Tag color={color} key={userInfo?.userName}>
            {userInfo?.userName}
          </Tag>
        );
      },
    },
    {
      title: selectedRowKeys.length > 0 && (
        <Dropdown
          overlay={
            <Menu
              items={drawHeaderMenu()} // 함수 호출을 통해 record를 전달합니다.
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
      ),
      key: "action",
      className: "text-xs",
      render: (_, record) =>
        selectedRowKeys?.length === 0 && (
          <Dropdown
            overlay={
              <Menu
                items={drawMenu(record)} // 함수 호출을 통해 record를 전달합니다.
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
        ),
    },
  ];

  const convertTimestampToDate = (timestamp) => {
    if (!timestamp || typeof timestamp.seconds !== "number") {
      return "";
    }

    try {
      return new Date(timestamp.seconds * 1000).toISOString().split("T")[0];
    } catch (error) {
      console.error("Date conversion error:", error);
      return "";
    }
  };

  const formatDatesInArray = (data) => {
    return data.map((item) => {
      // Firestore Timestamp에서 JavaScript Date 객체로 변환

      const assetPurchasedDateConverted = convertTimestampToDate(
        item.assetPurchasedDate
      );
      const createdAtConverted = convertTimestampToDate(item.createdAt);

      // 기존 객체에 변환된 날짜를 추가
      return {
        ...item,
        assetPurchasedDateConverted,
        createdAtConverted,
      };
    });
  };

  useEffect(() => {
    if (selectedRowKeys.length > 0 && assetList.length > 0) {
      const filteredAssets = assetList.filter((asset) =>
        selectedRowKeys.includes(asset.id.toString())
      );
      setAssetMultiList(filteredAssets);
    }
  }, [selectedRowKeys]);

  const fetchAsset = async () => {
    try {
      await assetQuery.getDocuments("assets", (data) => {
        setAssetList(() =>
          formatDatesInArray(data).sort((a, b) =>
            a.assetCategory.localeCompare(b.assetCategory)
          )
        );

        //console.log(formatDatesInArray(data));
        setAssetCategoryList(groupByKey(data, "assetCategory"));
        setAssetVendorList(groupByKey(data, "assetVendor"));
        setAssetPurchaseNameList(groupByKey(data, "assetPurchaseName"));
        setLocationList(groupByKey(data, "location"));
        setUserInfoList(groupByKey(data, "userInfo"));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRowNavigate = (record) => {
    navigate("/8e4314e1-ec72-47b5-84e2-114a5e7a697a", {
      state: { data: record },
    });
  };

  const rowClassName = (record, index) => {
    return "text-xs  hover:bg-gray-100";
  };

  const handleReduceParamArray = (array, value) => {
    const filtered = array.filter((f) => f === value);
    const notFiltered = array.filter((f) => f !== value);

    if (filtered.length === 0) {
      filtered.push(...notFiltered);
      filtered.push(value);
      return filtered;
    }
    if (filtered.length > 0) {
      return notFiltered;
    }
  };

  const handleSearchParams = (paramType, paramList, value) => {
    switch (paramType) {
      case "assetCategory":
        setSearchParams(() => ({
          ...searchParams,
          assetCategory: handleReduceParamArray(
            searchParams.assetCategory,
            value
          ),
        }));
        break;
      case "assetVendor":
        setSearchParams(() => ({
          ...searchParams,
          assetVendor: handleReduceParamArray(searchParams.assetVendor, value),
        }));
        break;

      case "assetPurchaseName":
        setSearchParams(() => ({
          ...searchParams,
          assetPurchaseName: handleReduceParamArray(
            searchParams.assetPurchaseName,
            value
          ),
        }));
        break;

      case "location":
        setSearchParams(() => ({
          ...searchParams,
          location: handleReduceParamArray(searchParams.location, value),
        }));
        break;

      case "useInfo":
        setSearchParams(() => ({
          ...searchParams,
          useInfo: handleReduceParamArray(searchParams.useInfo, value),
        }));
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setSearchParamsList([
      ...Object.values(searchParams)
        .map((param) => {
          return param;
        })
        .flat(),
    ]);
  }, [searchParams]);

  const filteredAssetList = useMemo(() => {
    // 기존 searchParams에 따른 필터링과 검색 키워드에 따른 필터링을 함께 적용
    return assetList.filter((asset) => {
      // searchParams에 따른 필터링 조건
      const matchesSearchParams = Object.keys(searchParams).every((key) => {
        return (
          !searchParams[key].length || searchParams[key].includes(asset[key])
        );
      });

      // 검색 키워드에 따른 필터링 조건
      const matchesSearchKeyword =
        !searchKeyword ||
        Object.values(asset).some((value) => {
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(searchKeyword.toLowerCase())
          );
        });

      return matchesSearchParams && matchesSearchKeyword;
    });
  }, [assetList, searchParams, searchKeyword]); // searchKeyword를 의존성 배열에 추가

  useEffect(() => {
    fetchAsset();
  }, []);

  const buttonUnCheckStyle = "bg-gray-100 text-xs p-2 cursor-pointer";
  const buttonCheckStyle =
    "flex justify-center items-center text-xs px-2 bg-green-500 rounded-2xl h-7 text-gray-100 cursor-pointer";
  const sections = [
    { title: "브랜드", param: "assetCategory", list: assetCategoryList },
    { title: "제조사", param: "assetVendor", list: assetVendorList },
    {
      title: "구입처",
      param: "assetPurchaseName",
      list: assetPurchaseNameList,
    },
    {
      title: "자산위치",
      param: "location",
      list: locationList,
    },
  ];
  return (
    <div className="flex w-full justify-center items-start ">
      <ConfigProvider
        theme={{
          components: {
            Table: {
              rowHoverBg: "rgba(182, 212, 252, 0.3)",
              /* here is your component tokens */
            },
          },
        }}
      >
        <div
          className="flex w-full h-full flex-col rounded-lg"
          style={{
            backgroundColor: "#fff",
            minHeight: "100%",
          }}
        >
          <div className="flex w-full ">
            <ContentTitle title="자산목록" />
          </div>
          <Modal
            mask={false}
            maskClosable={false}
            keyboard={false}
            className="w-full h-full"
            style={{
              minWidth: "800px",
              maxWidth: "1200px",
              width: "100%",
              top: 0,
            }}
            title="자산 모아보기"
            footer={null}
            open={multiModalProp.open}
            onOk={() => setMultiModalProp(() => ({ open: false, data: null }))}
            onCancel={() =>
              setMultiModalProp(() => ({ open: false, data: null }))
            }
          >
            <AssetFlex data={multiModalProp.data} />
          </Modal>
          <Modal
            mask={false}
            maskClosable={false}
            keyboard={false}
            wrapClassName="aaa"
            width={500}
            style={{
              position: "fixed",
              // transform: 'translateX(-50%)',
              left: (document.body.clientWidth - 500) / 2,
            }}
            title="자산 요약"
            footer={null}
            open={modalProp.open}
            onOk={() => setModalProp(() => ({ open: false, data: null }))}
            onCancel={() => setModalProp(() => ({ open: false, data: null }))}
          >
            <AssetView data={modalProp.data} />
          </Modal>
          <Modal
            mask={false}
            maskClosable={false}
            keyboard={false}
            footer={null}
            style={{ width: "100%", height: "100%", top: 0 }}
            open={isAssetAssignment.visible}
            onCancel={() =>
              setIsAssetAssignment({ ...isAssetAssignment, visible: false })
            }
          >
            <AssetAssignment
              data={isAssetAssignment.data}
              setClose={isAssetAssignment}
            />
          </Modal>

          <div className="flex w-full px-4 flex-col mb-5 ">
            {sections.map(({ title, param, list }) => (
              <div className="flex w-full" key={title}>
                <div
                  className="flex bg-gray-500 pl-4 justify-start items-center"
                  style={{ width: "130px" }}
                >
                  <span className="font-semibold text-gray-100 text-xs">
                    {title}
                  </span>
                </div>
                <div className="flex bg-gray-100 flex-wrap gap-1 px-4 justify-start items-center w-full h-10">
                  {list.length > 0 &&
                    list.map((type, idx) => (
                      <div
                        key={idx}
                        className={
                          searchParams[param].some((f) => f === type.label)
                            ? buttonCheckStyle
                            : buttonUnCheckStyle
                        }
                        onClick={() => {
                          handleSearchParams(param, searchParams, type.label);
                        }}
                      >
                        {type.label}
                      </div>
                    ))}
                </div>
              </div>
            ))}
            <div className="flex w-full" key="searchKeyword">
              <div
                className="flex bg-gray-500 pl-4 justify-start items-center"
                style={{ width: "130px", height: "55px" }}
              >
                <span className="font-semibold text-gray-100 text-xs">
                  검색어
                </span>
              </div>
              <div
                className="flex bg-gray-100 flex-wrap gap-1 px-4 justify-start items-center w-full"
                style={{ height: "55px" }}
              >
                <Input.Search
                  style={{ width: media.isMobile ? 230 : 300 }}
                  onChange={(e) =>
                    e.target.value.trim() === "" && setSearchKeyword("")
                  }
                  onSearch={(value) => setSearchKeyword(value)}
                />
              </div>
            </div>
          </div>

          <div className="flex w-full px-4 justify-center items-start">
            {assetList.length > 0 ? (
              !media.isMobile ? (
                <Table
                  rowSelection={rowSelection}
                  size="small"
                  columns={tableColumns}
                  dataSource={filteredAssetList}
                  className="w-full  "
                  rowKey={"id"}
                  rowClassName={rowClassName}
                  pagination={{ currnet: 1, pageSize: 10 }}
                />
              ) : (
                <List
                  dataSource={filteredAssetList}
                  renderItem={(item) => {
                    const {
                      assetName,
                      assetCode,
                      assetCategory,
                      assetProductLine,
                      location,
                      userInfo,
                      assetPurchasedDateConverted,
                    } = item;
                    const descriptionItems = [
                      {
                        key: 1,
                        label: "자산명",
                        children: (
                          <button onClick={() => handleRowNavigate(item)}>
                            {assetName}
                          </button>
                        ),
                        span: 4,
                      },
                      {
                        key: 2,
                        label: <span>자산코드</span>,
                        span: 4,
                        children: (
                          <span style={{ fontSize: 12 }}>{assetCode}</span>
                        ),
                      },
                      {
                        key: 3,
                        label: "구입일자",
                        span: 4,
                        children: <span>{assetPurchasedDateConverted}</span>,
                      },
                      {
                        key: 5,

                        children: <span>{assetCategory}</span>,
                      },
                      {
                        key: 7,
                        children: <span>{assetProductLine}</span>,
                      },
                      {
                        key: 9,
                        children: <span>{userInfo?.userName}</span>,
                      },
                      {
                        key: 11,
                        children: <span>{location}</span>,
                      },
                    ];

                    return (
                      <List.Item>
                        <Card size="small">
                          <Descriptions
                            items={descriptionItems}
                            size="small"
                            column={4}
                          />
                        </Card>
                      </List.Item>
                    );
                  }}
                />
              )
            ) : (
              <Empty description="등록된 자산이 없습니다." />
            )}
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default ListAsset;
