import { Card, Empty, Flex } from "antd";
import React, { useEffect, useState } from "react";
import AssetView from "./AssetView";

const AssetFlex = ({ data = [] }) => {
  const [assets, setAssets] = useState([]);
  useEffect(() => {
    if (data.length > 0) {
      setAssets(data);
    }
  }, [data]);

  useEffect(() => {
    console.log(assets);
  }, [assets]);

  return (
    <div className="w-full h-full flex justify-center items-start flex-wrap gap-2">
      {assets.length > 0 ? (
        assets.map((asset, aIdx) => (
          <Card
            size="small"
            hoverable
            style={{ maxWidth: "350px", height: "350px" }}
          >
            <AssetView data={asset} />
          </Card>
        ))
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default AssetFlex;
