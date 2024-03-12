import React, { useContext, useEffect, useState } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { useLocation } from "react-router";
import PageContainer from "../layout/PageContainer";
import { navigateMenus } from "../navigate";
import { Col } from "antd";

const AddAssetWizard = () => {
  const { memberSettings, media } = useContext(CurrentLoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
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
      <Col span={24}>
        <div>AddAsset</div>
      </Col>
    </PageContainer>
  );
};

export default AddAssetWizard;
