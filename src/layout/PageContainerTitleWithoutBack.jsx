import { Typography } from "antd";
import React from "react";
const { Title } = Typography;
const PageContainerTitleWithoutBack = ({ label, classNames, styles }) => {
  return (
    <div className={`flex w-full ${classNames}`} style={styles}>
      <Title level={4}>{label}</Title>
    </div>
  );
};

export default PageContainerTitleWithoutBack;
