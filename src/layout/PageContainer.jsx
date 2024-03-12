import React from "react";
import { IsLoadingDiv, pageInlineStyle, pageTailWind } from "./PageStyles";
import PageBreadCrumb from "../utils/PageBreadCrumb";
import PageContainerTitleWithoutBack from "./PageContainerTitleWithoutBack";
import { Row } from "antd";

const PageContainer = ({
  children,
  isLoading,
  pathname,
  title,
  gutter = [8, 8],
}) => {
  return (
    <div className={pageTailWind} style={pageInlineStyle}>
      {isLoading && <IsLoadingDiv />}
      {!isLoading && (
        <div className="flex flex-col w-full h-full justify-start items-center">
          {pathname && <PageBreadCrumb pathname={pathname} />}
          <PageContainerTitleWithoutBack label={title} classNames="my-2" />
          <Row gutter={gutter} className="w-full">
            {children}
          </Row>
        </div>
      )}
    </div>
  );
};

export default PageContainer;
