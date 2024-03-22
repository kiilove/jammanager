import { Empty, Image } from "antd";
import React from "react";

const AssetAgreementPics = ({ data }) => {
  return (
    <div
      className="flex w-full h-full justify-center items-start"
      style={{ minHeight: 500 }}
    >
      <div className="flex gap-2  justify-center items-start">
        {(data?.length === 0 || !data) && (
          <Empty description="사진정보가 없습니다." />
        )}
        {data?.length > 0 &&
          data.map((item, idx) => {
            const { url } = item;
            return <Image src={url} width={180} height={180} />;
          })}
      </div>
    </div>
  );
};

export default AssetAgreementPics;
