import React, { useEffect, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { ConfigProvider, Empty, Table } from "antd";
import { useNavigate } from "react-router-dom";

const ListAsset = () => {
  const [assetList, setAssetList] = useState([]);
  const assetQuery = useFirestoreQuery();
  const navigate = useNavigate();

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
        //console.log(formatDatesInArray(data));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRowNavigate = (record) => {
    return {
      onClick: () => {
        navigate("/8e4314e1-ec72-47b5-84e2-114a5e7a697a", {
          state: { recordId: record.id },
        }); // Navigate to the desired path. Adjust the path as needed.
      },
    };
  };

  // Use Tailwind CSS classes directly
  const rowClassName = (record, index) => {
    // You can add more logic here if you want to apply different styles based on the record or index
    return "cursor-pointer hover:bg-gray-100";
  };

  useEffect(() => {
    fetchAsset();
  }, []);

  return (
    <div className="flex w-full justify-center items-start">
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
        {assetList.length > 0 ? (
          <Table
            columns={tableColumns}
            dataSource={assetList}
            className="w-full  "
            onRow={handleRowNavigate}
            rowClassName={rowClassName}
          />
        ) : (
          <Empty description="표시할 데이터가 없습니다." />
        )}
      </ConfigProvider>
    </div>
  );
};

export default ListAsset;
