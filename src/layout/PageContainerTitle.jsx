import { Button, Typography } from "antd";
import React from "react";
import { TiArrowBack } from "react-icons/ti";
import { IoMdArrowBack } from "react-icons/io";
const { Title } = Typography;

const PageContainerTitle = ({
  label,
  classNames,
  styles,
  isBackKey = false,
}) => {
  return (
    <div
      className={`flex w-full h-full justify-start items-center gap-x-5 ${classNames}`}
      style={styles}
    >
      {isBackKey && (
        <Button
          icon={<IoMdArrowBack style={{ fontSize: 20 }} />}
          className="flex  justify-center items-center border-none"
          style={{ width: 30, height: 30 }}
          onClick={() => window.history.back()}
        />
      )}

      <Title level={4} className={isBackKey ? "mt-2" : "ml-4  mt-2"}>
        {label}
      </Title>
    </div>
  );
};

export default PageContainerTitle;
