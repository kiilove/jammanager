import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import Draggable from "react-draggable";
import {
  Button,
  ConfigProvider,
  Dropdown,
  Empty,
  Image,
  Input,
  Menu,
  Modal,
  Table,
  Tag,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { BiDetail } from "react-icons/bi";
import { FaUserTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ContentTitle } from "../commonstyles/Title";
import { groupByKey, highlightText } from "../functions";
import dayjs from "dayjs";
import "./ListAsset.css";
import AssetView from "../components/AssetView";

const ListAsset = () => {
  const [assetList, setAssetList] = useState([]);
  const assetQuery = useFirestoreQuery();
  const navigate = useNavigate();
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null); // 모달에 표시될 내용
  const [dragDisabled, setDragDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const [modals, setModals] = useState([]);

  const draggleRef = useRef(null);

  const handleViewDetail = (record) => {
    const newModal = {
      ...record, // 모달에 표시할 내용
    };
    setModals([...modals, newModal]);
  };

  // 모달 제거 함수
  const removeModal = (id) => {
    setModals(modals.filter((modal) => modal.id !== id));
  };

  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current.getBoundingClientRect();
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const modalDraggable = (nodeRef) => {
    return (
      <Draggable bounds="parent" handle=".draggable-handle">
        <div ref={nodeRef}>
          {/* 이 div는 Draggable의 자식으로, Modal을 감싸줍니다. */}
        </div>
      </Draggable>
    );
  };

  const drawItem = (record) => [
    {
      key: "0",
      icon: <BiDetail className="text-base" />,
      label: <span className="text-xs">자세히보기</span>,
      onClick: () => {
        handleViewDetail(record); // 여기서 record는 현재 행의 데이터입니다.
      },
    },
    {
      key: "1",
      icon: <FaUserTag className="text-base" />,
      label: <span className="text-xs">사용자배정</span>,
    },
  ];

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
      title: "입고일자",
      dataIndex: "assetPurchasedDate",
      key: "assetPurchasedDate",
      className: "text-xs",
      showSorterTooltip: false,
      sorter: (a, b) =>
        new Date(a.assetPurchasedDate) - new Date(b.assetPurchasedDate),
      render: (text) => <>{highlightText(text, searchKeyword)}</>,
    },
    {
      title: "등록일자",
      dataIndex: "createdAt",
      key: "createdAt",
      className: "text-xs",
      showSorterTooltip: false,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => <>{highlightText(text, searchKeyword)}</>,
    },
    {
      title: "사용일수(사용개월수)",
      key: "usageDaysMonths",
      className: "text-xs",
      showSorterTooltip: false,
      render: (_, record) => {
        const purchasedAt = dayjs(record.assetPurchasedDate);
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
        let color = "green";
        switch (userInfo) {
          case "폐기":
            color = "volcano";
            break;
          case "미배정":
            color = "geekblue";

          default:
            break;
        }

        return (
          <Tag color={color} key={userInfo}>
            {userInfo}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "action",
      className: "text-xs",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu
              items={drawItem(record)} // 함수 호출을 통해 record를 전달합니다.
            />
          }
        >
          <a onClick={(e) => e.preventDefault()}>
            <EllipsisOutlined style={{ fontSize: "20px" }} />
          </a>
        </Dropdown>
      ),
    },
  ];

  const formatDatesInArray = (data) => {
    return data.map((item) => {
      // Firestore Timestamp에서 JavaScript Date 객체로 변환
      const assetPurchasedDate = item.assetPurchasedDate
        ? new Date(item.assetPurchasedDate.seconds * 1000)
            .toISOString()
            .split("T")[0]
        : "";

      const createdAt = item.createdAt
        ? new Date(item.createdAt.seconds * 1000).toISOString().split("T")[0]
        : "";

      // 기존 객체에 변환된 날짜를 추가
      return {
        ...item,
        assetPurchasedDate,
        createdAt,
      };
    });
  };

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
    console.log(record);
    navigate("/8e4314e1-ec72-47b5-84e2-114a5e7a697a", {
      state: { recordId: record.id },
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
          {modals.map((modal) => {
            console.log(modal);
            const {
              id,
              assetCategory,
              assetCode,
              assetCost,
              assetDepreciationPeroid,
              assetDepreciationType,
              assetDescritionSummay,
              assetModel,
              assetName,
              assetOwner,
              assetOwnerCompany,
              assetProductLine,
              assetPurchaseName,
              assetPurchasedDate,
              assetVendor,
              createdAt,
              location,
              userInfo,
              firstPics,
            } = modal;
            return (
              <Draggable key={modal.id}>
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
                  title={
                    <div
                      style={{
                        width: "100%",
                        cursor: "move",
                      }}
                      onMouseOver={() => {
                        if (dragDisabled) {
                          setDragDisabled(false);
                        }
                      }}
                      onMouseOut={() => {
                        setDragDisabled(true);
                      }}
                      onFocus={() => {}}
                      onBlur={() => {}}
                    >
                      <div className="flex justify-between items-end">
                        <div className="flex">
                          <div className="flex flex-col justify-start ml-4">
                            <div>자산정보</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  footer={null}
                  open={true}
                  onOk={() => removeModal(modal.id)}
                  onCancel={() => removeModal(modal.id)}
                  modalRender={(modal) => (
                    <Draggable
                      disabled={dragDisabled}
                      bounds={bounds}
                      onStart={(event, uiData) => onStart(event, uiData)}
                    >
                      <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                  )}
                >
                  <AssetView data={modal} />
                </Modal>
              </Draggable>
            );
          })}

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
                  style={{ width: 300 }}
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
              <Empty description="등록된 자산이 없습니다." />
            )}
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default ListAsset;
