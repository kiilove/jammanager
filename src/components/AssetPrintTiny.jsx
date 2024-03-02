import { Card, QRCode } from "antd";
import React from "react";

export const AssetPrintTiny = ({ data, scale }) => {
  return (
    <div className="">
      <QRCode size={120 * scale} value={data.id} />
    </div>
  );
};
