import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";

import { Col, Dropdown, Menu, Modal } from "antd";
import { GrMultiple } from "react-icons/gr";
import { IoReturnUpBack } from "react-icons/io5";
import { MdMoreVert, MdOutlineViewCompactAlt, MdSend } from "react-icons/md";

import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt, FaUserTag } from "react-icons/fa";

import { SlPrinter } from "react-icons/sl";
import { useLocation, useNavigate } from "react-router-dom";
import { highlightText } from "../functions";

import "./ListAsset.css";
import AssetView from "../components/AssetView";
import AssetAssignment from "../components/AssetAssignment";
import { CurrentLoginContext } from "../context/CurrentLogin";
import AssetFlex from "../components/AssetFlex";
import { where } from "firebase/firestore";
import {
  ConvertTimestampToDateByArray,
  FilterKeyByArray,
  setColumnItem,
  setMenuItem,
  setSections,
} from "../utils/Index";
import { FilterBar } from "../share/Index.js";
import { TableWithFilterAndSearch } from "../widget/Index.js";
import AssetFeedAdd from "../components/AssetFeedAdd.jsx";
import { navigateMenus } from "../navigate.js";
import PageContainer from "../layout/PageContainer.jsx";

const ListAsset = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assetMultiList, setAssetMultiList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [assetList, setAssetList] = useState([]);
  const [filteredAssetList, setFilteredAssetList] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [modalReturn, setModalReturn] = useState({
    open: false,
    data: "",
  });
  const [modalAssign, setModalAssign] = useState({
    open: false,
    data: "",
  });
  const [modalView, setModalView] = useState({
    open: false,
    data: null,
  });
  const [modalMultiView, setModalMultiView] = useState({
    open: false,
    data: null,
  });
  const [modalFeed, setModalFeed] = useState({ open: false, data: null });

  const assetQuery = useFirestoreQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const { memberSettings, media } = useContext(CurrentLoginContext);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };
  const handleViewAssetDefined = (record) => {
    setModalAssign({
      visible: true,
      data: record,
    });
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
                      setModalMultiView({ open: true, data: assetMultiList });
                    },
                    selectedRowKeys
                  ),

                  setMenuItem(
                    selectedRowKeys.length > 0 ? false : true,
                    "자산인쇄",
                    <SlPrinter className="text-base" />,
                    5,
                    (value) => {
                      navigate("/261c956d-a9ce-4e22-aec2-8d9398b7af9b", {
                        state: { data: assetMultiList },
                      });
                    },
                    selectedRowKeys
                  ),
                  setMenuItem(
                    selectedRowKeys.length > 0 ? false : true,
                    "선택삭제",
                    <FaRegTrashAlt className="text-base" />,
                    7,
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
                        setModalView({ open: true, data: value });
                      },
                      record
                    ),
                    setMenuItem(
                      false,
                      "이력남기기",
                      <MdSend className="text-base" />,
                      3,
                      (value) => {
                        setModalFeed({ open: true, data: record });
                      },
                      selectedRowKeys
                    ),
                    record?.userInfo?.userName === "미지정"
                      ? setMenuItem(
                          false,
                          "자산배정",
                          <FaUserTag className="text-base" />,
                          5,
                          () => {
                            //setModalAssign({ open: true, data: record });
                            navigate(
                              navigateMenus.find((f) => f.label === "자산배정")
                                .link,
                              { state: { data: record } }
                            );
                          },
                          record
                        )
                      : setMenuItem(
                          false,
                          "자산반납",
                          <IoReturnUpBack className="text-base" />,
                          5,
                          (value) => {
                            setModalReturn({ open: true, data: record });
                          },
                          record
                        ),
                    setMenuItem(
                      false,
                      "자산수정",
                      <CiEdit className="text-base" />,
                      7,
                      (value) => {
                        console.log(value);
                      },
                      record
                    ),
                    setMenuItem(
                      false,
                      "자산인쇄",
                      <SlPrinter className="text-base" />,
                      9,
                      (value) => {
                        console.log(value);
                      },
                      selectedRowKeys
                    ),
                    setMenuItem(
                      false,
                      "삭제",
                      <FaRegTrashAlt className="text-base" />,
                      11,
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
    };
  };

  const fetchAsset = async (id) => {
    const condition = [where("assetOwner", "==", id)];
    const filterKeys = [
      "assetCategory",
      "assetProductLine",
      "assetVendor",
      "assetPurchasedType",
      "assetPurchaseName",
    ];

    try {
      await assetQuery.getDocuments(
        "assets",
        (data) => {
          const convertDate = [...ConvertTimestampToDateByArray(data)];
          const grouped = FilterKeyByArray(data, filterKeys);

          setAssetList(() => [
            ...convertDate.sort((a, b) =>
              a.assetCategory.localeCompare(b.assetCategory)
            ),
          ]);
          setFilteredAssetList(() => [
            ...convertDate.sort((a, b) =>
              a.assetCategory.localeCompare(b.assetCategory)
            ),
          ]);
          setFilterItems(() => [
            setSections("분류", filterKeys[0], grouped.assetCategoryGrouped),
            setSections("품목", filterKeys[1], grouped.assetProductLineGrouped),
            setSections("제조사", filterKeys[2], grouped.assetVendorGrouped),
            setSections(
              "취득방식",
              filterKeys[3],
              grouped.assetPurchasedTypeGrouped
            ),
            setSections(
              "구매처",
              filterKeys[4],
              grouped.assetPurchaseNameGrouped
            ),
          ]);
        },
        condition
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleRowNavigate = (record) => {
    navigate("/8e4314e1-ec72-47b5-84e2-114a5e7a697a", {
      state: { data: record },
    });
  };

  const assetColumn = [
    setColumnItem("분류", "assetCategory", searchKeyword),
    setColumnItem("품목", "assetProductLine", searchKeyword),
    setColumnItem("자산명", "assetName", searchKeyword, (text, record) => (
      <button
        className="flex justify-start items-start flex-col"
        onClick={() => handleRowNavigate(record)}
      >
        <span>{highlightText(text, searchKeyword)}</span>
        <span style={{ fontSize: 11 }}>
          {highlightText(record.assetCode, searchKeyword)}
        </span>
      </button>
    )),
    setColumnItem("제조사", "assetVendor", searchKeyword),
    setColumnItem("모델명", "assetModel", searchKeyword),
    setColumnItem("구매처", "assetPurchaseName", searchKeyword),
    setColumnItem("구매일자", "assetPurchasedDateConverted", searchKeyword),
    setColumnItem("위치", "location", searchKeyword),
    setColumnItem("사용자", "currentUser", searchKeyword),
    setActionColumnItem(),
  ];

  useEffect(() => {
    if (selectedRowKeys.length > 0 && assetList.length > 0) {
      const filteredAssets = assetList.filter((asset) =>
        selectedRowKeys.includes(asset.id.toString())
      );
      setAssetMultiList(filteredAssets);
    }
  }, [selectedRowKeys]);
  useEffect(() => {
    if (memberSettings.userID) {
      fetchAsset(memberSettings.userID);
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
              originData={assetList}
              data={filteredAssetList}
              setData={setFilteredAssetList}
              setKeyword={setSearchKeyword}
            />
          )}
          <div className="flex w-full">
            <TableWithFilterAndSearch
              columns={assetColumn}
              data={filteredAssetList}
              rowSelection={rowSelection}
              rowKey="id"
              size="small"
            />
          </div>
          <Modal
            mask={false}
            maskClosable={false}
            keyboard={false}
            style={{
              minWidth: "800px",
              maxWidth: "1200px",
              width: "100%",
              top: 0,
            }}
            title="자산 모아보기"
            footer={null}
            open={modalMultiView.open}
            onOk={() => setModalMultiView(() => ({ open: false, data: null }))}
            onCancel={() =>
              setModalMultiView(() => ({ open: false, data: null }))
            }
          >
            <AssetFlex data={modalMultiView.data} />
          </Modal>
          <Modal
            mask={false}
            maskClosable={false}
            keyboard={false}
            width={500}
            title="자산 요약"
            footer={null}
            open={modalView.open}
            onOk={() => setModalView(() => ({ open: false, data: null }))}
            onCancel={() => setModalView(() => ({ open: false, data: null }))}
          >
            <AssetView data={modalView.data} />
          </Modal>
          <Modal
            mask={false}
            maskClosable={false}
            keyboard={false}
            width={500}
            title="자산 배정"
            footer={null}
            open={modalAssign.open}
            onOk={() => setModalAssign(() => ({ open: false, data: null }))}
            onCancel={() => setModalAssign(() => ({ open: false, data: null }))}
          >
            <AssetAssignment data={modalAssign.data} />
          </Modal>
          <Modal
            mask={false}
            maskClosable={false}
            keyboard={false}
            width={500}
            title="이력 남기기"
            footer={null}
            open={modalFeed.open}
            onOk={() => setModalFeed(() => ({ open: false, data: null }))}
            onCancel={() => setModalFeed(() => ({ open: false, data: null }))}
          >
            <AssetFeedAdd data={modalFeed.data} setClose={setModalFeed} />
          </Modal>
        </div>
      </Col>
    </PageContainer>
  );
};

export default ListAsset;
