import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { navigateMenus } from "../navigate";
import PageBreadCrumb from "../utils/PageBreadCrumb";
import { Card, Col, Row, Space, Typography } from "antd";
import {
  IsLoadingDiv,
  pageContentContainerTailWind,
  pageInlineStyle,
  pageTailWind,
} from "../layout/PageStyles";
import PageContainerTitleWithoutBack from "../layout/PageContainerTitleWithoutBack";
import { CurrentLoginContext } from "../context/CurrentLogin";
import AssetInfoDetail from "../components/AssetInfoDetail";
import AssetUserAgreement from "../documents/AssetUserAgreement";
const { Title, Text } = Typography;
const AssetAssignment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { media } = useContext(CurrentLoginContext);
  // const breadCrumbItems = [
  //   {
  //     path: "/",
  //     breadcrumbName: "홈",
  //   },
  //   {
  //     path: navigateMenus.find
  //   }
  // ];

  useEffect(() => {
    console.log(location);
    if (location.pathname) {
      setIsLoading(false);
    }
  }, [location]);

  return (
    <div className={pageTailWind} style={pageInlineStyle}>
      {isLoading && <IsLoadingDiv />}
      {!isLoading && (
        <div className="flex flex-col w-full h-full justify-start items-center">
          <PageBreadCrumb pathname={location.pathname} />
          <PageContainerTitleWithoutBack
            label={
              navigateMenus.find((f) => f.link === location.pathname).label
            }
            classNames="my-2"
          />
          <Row gutter={[8, 8]} className="w-full">
            <Col span={media.isDesktopOrLaptop ? 12 : 24}>
              <Card
                title={<span style={{ fontWeight: 600 }}>자산정보</span>}
                size="small"
                classNames="w-full"
              >
                <AssetInfoDetail data={location.state.data} />
              </Card>
            </Col>
            <Col span={media.isDesktopOrLaptop ? 12 : 24}>
              <Card
                title={<span style={{ fontWeight: 600 }}>동의서</span>}
                size="small"
                classNames="w-full"
              >
                <AssetUserAgreement data={location.state.data} />
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default AssetAssignment;
