import { ConfigProvider, Table } from "antd";
import React, { useState } from "react";

export const TableWithFilterAndSearch = ({
  columns,
  data,
  rowSelection,
  rowKey = "id",
  size = "small",
  rowHoverBg = "rgba(182, 212, 252, 0.3)",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            rowHoverBg: rowHoverBg,
            /* here is your component tokens */
          },
        },
      }}
    >
      <Table
        columns={columns}
        size={size}
        dataSource={data}
        className="w-full "
        rowKey={rowKey}
        rowSelection={rowSelection}
      />
    </ConfigProvider>
  );
};
