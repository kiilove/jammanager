import { Card, ConfigProvider, QRCode } from "antd";
import React from "react";

export const AssetPrintTiny = ({ data, scale, printBorder }) => {
  return (
    <div className="">
      <ConfigProvider
        theme={{
          token: {
            marginXS: 0,
            paddingSM: printBorder ? 5 : 0,
          },
        }}
      >
        <QRCode
          bordered={false}
          size={37.7 * scale}
          value={`https://jncore-asset.web.app/cc815a57-69fb-4e29-a6f6-e8e7cfe8de66/${data.id}`}
        />
      </ConfigProvider>
    </div>
  );
};
