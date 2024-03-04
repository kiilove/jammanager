import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";

import {
  Card,
  ConfigProvider,
  Descriptions,
  Dropdown,
  Empty,
  Input,
  List,
  Menu,
  Modal,
  Table,
  Tag,
} from "antd";
import { FiPrinter } from "react-icons/fi";
import { GrMultiple } from "react-icons/gr";
import { IoReturnUpBack } from "react-icons/io5";
import { MdMoreVert, MdOutlineViewCompactAlt } from "react-icons/md";

import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt, FaUserTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ContentTitle } from "../commonstyles/Title";
import { groupByKey, highlightText } from "../functions";
import dayjs from "dayjs";
import "./ListAsset.css";
import AssetView from "../components/AssetView";
import AssetAssignment from "../components/AssetAssignment";
import { CurrentLoginContext } from "../context/CurrentLogin";
import AssetFlex from "../components/AssetFlex";
import { where } from "firebase/firestore";
import { ConvertDateByArray, FilterKeyByArray } from "../utils/Index";
import { FilterBar } from "../share/Index.js";
import { TableWithFilterAndSearch } from "../widget/Index.js";

const ListAsset = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assetMultiList, setAssetMultiList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [assetList, setAssetList] = useState([]);
  const [filteredAssetList, setFilteredAssetList] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [modalProp, setModalProp] = useState({
    open: false,
    data: null,
  });
  const [multiModalProp, setMultiModalProp] = useState({
    open: false,
    data: null,
  });

  const assetQuery = useFirestoreQuery();
  const navigate = useNavigate();
  const { memberSettings, media } = useContext(CurrentLoginContext);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const setSections = (label, dataIndex, list) => {
    return { title: label, param: dataIndex, list: list };
  };

  const setColumnItem = (label, dataIndex, customRender = null) => {
    return {
      key: dataIndex,
      title: label,
      label: label,
      dataIndex: dataIndex,
      className: "text-xs",
      sorter: (a, b) => a[dataIndex].localeCompare(b.assetCategory),
      render: (text, record) => (
        <>
          {customRender !== null
            ? customRender(text, record)
            : highlightText(text, searchKeyword)}
        </>
      ),
    };
  };

  const setMenuItem = (disabled, label, icon, index, action, value) => {
    return {
      key: index.toString(),
      disabled: disabled,
      index: index,
      icon: icon,
      label: <span className="text-xs">{label}</span>,
      onClick: () => {
        action(value);
      },
    };
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
                      setMultiModalProp({ open: true, data: assetMultiList });
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
                        setModalProp({ open: true, data: value });
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
          const convertDate = [...ConvertDateByArray(data)];
          const grouped = FilterKeyByArray(data, filterKeys);

          setAssetList(() => [...convertDate]);
          setFilteredAssetList(() => [...convertDate]);
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
    setColumnItem("분류", "assetCategory"),
    setColumnItem("자산명", "assetName", (text, record) => (
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
    setColumnItem("제조사", "assetVendor"),
    setColumnItem("모델명", "assetModel"),
    setColumnItem("구매처", "assetPurchaseName"),
    setColumnItem("구매일자", "assetPurchasedDateConverted"),
    setColumnItem("위치", "location"),
    setColumnItem("사용자", null, (text, record) => {
      return <span>{record?.userInfo?.userName}</span>;
    }),
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

  return (
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
      <div className="flex w-full px-5">
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
        onCancel={() => setMultiModalProp(() => ({ open: false, data: null }))}
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
    </div>
  );
};

export default ListAsset;
