import React, { useContext, useEffect, useState } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { Table } from "antd";

const ProductInfoDetail = ({ data }) => {
  const [descriptionItems, setDescriptionItems] = useState([]);
  const { media } = useContext(CurrentLoginContext);

  const infoTableColumns = [
    { key: 1, title: "품목", dataIndex: "name" },
    { key: 2, title: "수량", dataIndex: "count" },
  ];
  useEffect(() => {
    if (!data) {
      return;
    }
    console.log(data);
  }, [data]);

  return (
    <Table
      header="구성품"
      size="small"
      columns={infoTableColumns}
      dataSource={data?.assetAccessory || []}
    />
  );
};

export default ProductInfoDetail;
