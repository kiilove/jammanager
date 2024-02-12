import React, { useEffect, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { Empty, Table } from "antd";

const ListAsset = () => {
  const [assetList, setAssetList] = useState([]);
  const assetQuery = useFirestoreQuery();

  const tableColumns = [
    {
      title: "자산코드",
      dataIndex: "assetCode",
      key: "assetCode",
      width: "30px",
    },
    {
      title: "종류",
      dataIndex: "assetCategory",
      key: "assetCategory",
      sorter: (a, b) => a.assetCategory.localeCompare(b.assetCategory),
    },
    {
      title: "자산명",
      dataIndex: "assetName",
      key: "assetName",
      sorter: (a, b) => a.assetName.localeCompare(b.assetName),
    },
    {
      title: "제조사",
      dataIndex: "assetVendor",
      key: "assetVendor",
      sorter: (a, b) => a.assetVendor.localeCompare(b.assetVendor),
    },
    {
      title: "모델명",
      dataIndex: "assetModel",
      key: "assetModel",
      sorter: (a, b) => a.assetModel.localeCompare(b.assetModel),
    },
    {
      title: "매입처",
      dataIndex: "assetPurchaseName",
      key: "assetPurchaseName",
      sorter: (a, b) => a.assetName.localeCompare(b.assetName),
    },
    {
      title: "입고일자",
      dataIndex: "assetPurchasedDate",
      key: "assetPurchasedDate",
      sorter: (a, b) =>
        new Date(a.assetPurchasedDate) - new Date(b.assetPurchasedDate),
    },
    {
      title: "등록일자",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "자산위치",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "사용자",
      dataIndex: "userInfo",
      key: "userInfo",
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
        setAssetList(() => formatDatesInArray(data));
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAsset();
  }, []);

  return (
    <div className="flex w-full justify-center items-start">
      {assetList.length > 0 ? (
        <Table
          columns={tableColumns}
          dataSource={assetList}
          className="w-full"
        />
      ) : (
        <Empty description="표시할 데이터가 없습니다." />
      )}
    </div>
  );
};

export default ListAsset;
