import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { navigateMenus } from "../navigate";
import PageBreadCrumb from "../utils/PageBreadCrumb";
import { Button, Card, Col, Divider, Row, Space, Typography } from "antd";
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
import ProductInfoDetail from "../components/ProductInfoDetail";
import AddAssignment from "../components/AddAssignment";
import AssignmentProductCheck from "../components/AssignmentProductCheck";
import dayjs from "dayjs";
import ReactToPrint from "react-to-print";

const { Title, Text } = Typography;
const AssetAssignment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assetInfo, setAssetInfo] = useState({});
  const [productInfo, setProductInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const location = useLocation();
  const { media } = useContext(CurrentLoginContext);
  const printRef = useRef();
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
      setAssetInfo(location.state.data);
      const initProductInfo = {
        assetWorking: true,
        assetExterior: 5,
        assetAccessory: location.state.data?.assetAccessory,
      };
      setProductInfo(initProductInfo);
      const initUserInfo = {
        isReturnDate: false,
        assetReturnDate: "",
        location: location.state.data?.location,
        currentUser: location.state.data?.currentUser,
        userInfo: location.state.data?.userInfo,
        assetAssignmentDate: dayjs(),
      };
      setUserInfo(initUserInfo);
    }
  }, [location]);

  return (
    <PageContainer
      isLoading={isLoading}
      pathname={location?.pathname}
      title={navigateMenus.find((f) => f.link === location.pathname).label}
    >
      <Col span={media.isDesktopOrLaptop ? 12 : 24}>
        <Divider orientation="left" orientationMargin="0">
          <h1 className="font-semibold" style={{ fontSize: 13 }}>
            1. 자산정보
          </h1>
        </Divider>
        <AssetInfoDetail
          data={location.state.data}
          info={assetInfo}
          setInfo={setAssetInfo}
        />
        <Divider orientation="left" orientationMargin="0">
          <h1 className="font-semibold" style={{ fontSize: 13 }}>
            2. 제품
          </h1>
        </Divider>
        <AssignmentProductCheck
          data={location.state.data}
          productInfo={productInfo}
          setProductInfo={setProductInfo}
        />
        <Divider orientation="left" orientationMargin="0">
          <h1 className="font-semibold" style={{ fontSize: 13 }}>
            3. 배정
          </h1>
        </Divider>
        <AddAssignment
          data={location.state.data}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
        <Divider orientation="left" orientationMargin="0"></Divider>
        <div
          className="flex w-full justify-end items-center px-2 "
          style={{ height: 55 }}
        >
          <ReactToPrint
            trigger={() => (
              <Button type="default" style={{ margin: "16px" }}>
                동의서 인쇄
              </Button>
            )}
            content={() => printRef.current}
          />
        </div>
      </Col>
      <Col span={media.isDesktopOrLaptop ? 12 : 24}>
        <Card size="small" classNames="w-full">
          <div ref={printRef} className="p-5">
            <AssetUserAgreement
              data={location.state.data}
              assetInfo={assetInfo}
              productInfo={productInfo}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
            />
          </div>
        </Card>
      </Col>
    </PageContainer>
  );
};

export default AssetAssignment;
