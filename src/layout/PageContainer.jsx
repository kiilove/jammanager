import React, { useContext, useEffect } from "react";
import {
  IsLoadingDiv,
  pageInlineStyle,
  pageTailWind,
  pageTailWindMobile,
} from "./PageStyles";
import PageBreadCrumb from "../utils/PageBreadCrumb";

import { Row } from "antd";

import { CurrentLoginContext } from "../context/CurrentLogin";
import PageContainerTitle from "./PageContainerTitle";

const PageContainer = ({
  children,
  isLoading,
  pathname,
  title,
  gutter = [8, 8],
  backKey = false,
  backgroundColor = "#fff",
}) => {
  const { media } = useContext(CurrentLoginContext);

  useEffect(() => {
    console.log(media);
  }, [media]);

  return (
    <div
      className={media.isMobile ? pageTailWindMobile : pageTailWind}
      style={{ minHeight: "500px", backgroundColor }}
    >
      {isLoading && <IsLoadingDiv />}
      {!isLoading && (
        <div className="flex flex-col w-full h-full justify-start items-center">
          <div className="mb-2 flex flex-col w-full h-full justify-start items-center bg-white rounded ">
            <div className="flex px-4 w-full h-full justify-start items-center">
              {pathname && <PageBreadCrumb pathname={pathname} />}
            </div>

            <PageContainerTitle
              label={title}
              classNames="my-2"
              isBackKey={backKey}
            />
          </div>

          <Row gutter={gutter} className="w-full">
            <div
              className={`${
                media.isMobile ? "p-4 " : "p-0 "
              } flex w-full h-full  `}
            >
              {children}
            </div>
          </Row>
        </div>
      )}
    </div>
  );
};

export default PageContainer;
