import React, { useContext } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import ComponentContainerTitle from "./ComponetContainerTitle";
import { Row } from "antd";
import { componentTailWind, componentTailWindMobile } from "./PageStyles";

const ComponetContainer = ({
  children,
  isLoading,
  pathname,
  title,
  gutter = [8, 8],
}) => {
  const { media } = useContext(CurrentLoginContext);
  return (
    <div
      className={media.isMobile ? componentTailWindMobile : componentTailWind}
      style={{
        minHeight: "100px",
      }}
    >
      <div className="flex flex-col w-full h-full justify-start items-center px-2">
        <div className="mb-2 flex flex-col w-full h-auto justify-start items-center bg-white rounded ">
          <ComponentContainerTitle label={title} classNames="my-1" />
        </div>

        <Row gutter={gutter} className="w-full">
          <div
            className={`${
              media.isMobile ? "px-2 " : "p-0 "
            } flex w-full h-auto   justify-center items-start `}
          >
            {children}
          </div>
        </Row>
      </div>
    </div>
  );
};

export default ComponetContainer;
