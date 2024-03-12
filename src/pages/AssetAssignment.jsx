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
import PageContainer from "../layout/PageContainer";
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
    <PageContainer
      isLoading={isLoading}
      pathname={location?.pathname}
      title={navigateMenus.find((f) => f.link === location.pathname).label}
    >
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
    </PageContainer>
  );
};

export default AssetAssignment;
