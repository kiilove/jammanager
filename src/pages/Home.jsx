import { Avatar, Col, Image, Row, Button } from "antd";
import React, { useContext, useMemo, useState } from "react";
import CurrentAddAsset from "../share/CurrentAddAsset";
import { CurrentLoginContext } from "../context/CurrentLogin";
import JAMLOGO from "../assets/logo/jam_blank.png";
import { MdOutlineSearch } from "react-icons/md";
import { ImSearch } from "react-icons/im";
import {
  FcAddDatabase,
  FcFilingCabinet,
  FcBusinessman,
  FcContacts,
  FcExport,
  FcImport,
  FcSettings,
  FcAdvertising,
} from "react-icons/fc";
import { useEffect } from "react";
import DodutChart from "../share/DodutChart";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import SunburstChart from "../share/SunburstChart";
import CirclePackingChart from "../share/CirclePackingChart";

const Home = () => {
  const [iconSize, setIconSize] = useState(60);
  const [assetList, setAssetList] = useState([]);
  const { media, memberSettings } = useContext(CurrentLoginContext);
  const assetQuery = useFirestoreQuery();

  const groupByField = (data, fieldName) => {
    const grouped = data.reduce((acc, item) => {
      const key = item[fieldName];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([key, value]) => ({
      id: key,
      label: key,
      value: value,
    }));
  };

  const groupByCategoryAndProductLine = (data) => {
    // First group by assetCategory
    const categoryGrouped = data.reduce((acc, item) => {
      acc[item.assetCategory] = acc[item.assetCategory] || [];
      acc[item.assetCategory].push(item);
      return acc;
    }, {});

    // Then, for each category, group by assetProductLine and count
    const result = Object.entries(categoryGrouped).map(([category, items]) => {
      const productLineGrouped = items.reduce((acc, item) => {
        const line = item.assetProductLine;
        acc[line] = (acc[line] || 0) + 1;
        return acc;
      }, {});

      const children = Object.entries(productLineGrouped).map(
        ([key, value]) => ({
          id: key,
          label: key,
          value: value,
        })
      );

      return {
        id: category,
        label: category,
        children: children,
      };
    });

    return result;
  };

  const fetchAsset = async (userID) => {
    const condition = [where("assetOwner", "==", userID)];

    try {
      await assetQuery.getDocuments(
        "assets",
        (data) => {
          console.log(data);
          setAssetList(() => [...data]);
        },
        condition
      );
    } catch (error) {}
  };

  const reductChartData = useMemo(() => {
    let donutData = [];
    let sunburstData = [];
    if (assetList?.length > 0) {
      donutData = [...groupByField(assetList, "assetProductLine")];
      sunburstData = [...groupByCategoryAndProductLine(assetList)];
      console.log(sunburstData);
    }

    return { donutData, sunburstData };
  }, [assetList]);

  useEffect(() => {}, [assetList]);

  useEffect(() => {
    if (memberSettings?.userID) {
      fetchAsset(memberSettings.userID);
    }
  }, [memberSettings]);

  useEffect(() => {
    if (media) {
      console.log(media);
      if (media?.isMobile) {
        setIconSize(50);
      }
    }
  }, [media]);

  return (
    <div className="flex justify-center items-start">
      <Row
        gutter={[8, 8]}
        className={`${media.isMobile ? "px-2" : "px-0"}`}
        style={{ maxWidth: 1000 }}
      >
        <Col span={24}>
          <div
            className="flex w-full flex-col justify-start items-center py-5 h-auto gap-y-2"
            style={{ minHeight: 120 }}
          >
            <div className="flex w-full justify-center items-center">
              <div
                className="flex bg-white rounded-full border-2 justify-center items-center border-blue-300 px-2"
                style={{
                  width: media?.isMobile ? "100%" : 1000,
                  height: iconSize,
                }}
              >
                <div className="flex px-10 w-full">
                  <input
                    type="text"
                    className="w-full outline-none"
                    placeholder="통합검색"
                    style={{ fontSize: 16, fontWeight: 600 }}
                  />
                </div>
                <div className="flex px-4">
                  <button>
                    <ImSearch
                      style={{ fontSize: iconSize - 30 }}
                      className="text-blue-400"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div
              className="flex px-5 justify-around items-center flex-wrap box-border gap-5"
              style={{
                width: media?.isMobile
                  ? "100%"
                  : media?.isTablet
                  ? "90%"
                  : 1000,
                height: media?.isMobile ? "100%" : 100,
              }}
            >
              <div className="flex flex-col justify-start items-center gap-y-2">
                <button
                  className="flex justify-center items-center bg-white rounded-2xl shadow"
                  style={{ width: iconSize, height: iconSize }}
                >
                  <FcAddDatabase style={{ fontSize: iconSize - 15 }} />
                </button>
                <span>자산등록</span>
              </div>
              <div className="flex flex-col justify-start items-center gap-y-2">
                <button
                  className="flex justify-center items-center bg-white rounded-2xl shadow"
                  style={{ width: iconSize, height: iconSize }}
                >
                  <FcFilingCabinet style={{ fontSize: iconSize - 15 }} />
                </button>
                <span>자산대장</span>
              </div>
              <div className="flex flex-col justify-start items-center gap-y-2">
                <button
                  className="flex justify-center items-center bg-white rounded-2xl shadow"
                  style={{ width: iconSize, height: iconSize }}
                >
                  <FcBusinessman style={{ fontSize: iconSize - 15 }} />
                </button>
                <span>구성원등록</span>
              </div>
              <div className="flex flex-col justify-start items-center gap-y-2">
                <button
                  className="flex justify-center items-center bg-white rounded-2xl shadow"
                  style={{ width: iconSize, height: iconSize }}
                >
                  <FcExport style={{ fontSize: iconSize - 15 }} />
                </button>
                <span>자산배정대장</span>
              </div>
              <div className="flex flex-col justify-start items-center gap-y-2">
                <button
                  className="flex justify-center items-center bg-white rounded-2xl shadow"
                  style={{ width: iconSize, height: iconSize }}
                >
                  <FcImport style={{ fontSize: iconSize - 15 }} />
                </button>
                <span>자산반납대장</span>
              </div>
              <div className="flex flex-col justify-start items-center gap-y-2">
                <button
                  className="flex justify-center items-center bg-white rounded-2xl shadow"
                  style={{ width: iconSize, height: iconSize }}
                >
                  <FcAdvertising style={{ fontSize: iconSize - 15 }} />
                </button>
                <span>알림메세지</span>
              </div>
              <div className="flex flex-col justify-start items-center gap-y-2">
                <button
                  className="flex justify-center items-center bg-white rounded-2xl shadow"
                  style={{ width: iconSize, height: iconSize }}
                >
                  <FcSettings style={{ fontSize: iconSize - 15 }} />
                </button>
                <span>환경설정</span>
              </div>
            </div>
          </div>
        </Col>
        <Col span={media.isMobile ? 24 : media.isTablet ? 12 : 8}>
          <DodutChart data={reductChartData?.donutData} />
        </Col>
        <Col span={media.isMobile ? 24 : media.isTablet ? 12 : 8}>
          <CirclePackingChart data={reductChartData?.sunburstData} />
        </Col>{" "}
        <Col span={media.isMobile ? 24 : media.isTablet ? 12 : 8}>
          <CurrentAddAsset />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
