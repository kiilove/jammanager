import { Button, Typography } from "antd";
import React from "react";
import { TiArrowBack } from "react-icons/ti";
import { IoMdArrowBack } from "react-icons/io";
const { Title } = Typography;

const ComponentContainerTitle = ({ label, classNames, styles }) => {
  return (
    <div
      className={`flex w-full h-full justify-start items-center  gap-x-5 ${classNames}`}
      style={styles}
    >
      <Title level={5}>{label}</Title>
    </div>
  );
};

export default ComponentContainerTitle;
