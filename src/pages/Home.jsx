import { Avatar, Col, Image, Row } from "antd";
import React, { useContext, useState } from "react";
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

const Home = () => {
  const [iconSize, setIconSize] = useState(60);
  const { media, memberSettings } = useContext(CurrentLoginContext);

  useEffect(() => {
    if (media) {
      if (media.isMobile) {
        setIconSize(50);
      }
    }
  }, [media]);

  return (
    <div className="flex justify-center items-start">
      {media && (
        <Row
          gutter={[8, 8]}
          className={`${media.isMobile ? "px-2" : "px-0"}`}
          style={{ maxWidth: 1000 }}
        >
          {/* <Col span={24}>
            <div
              className="flex w-full flex-col justify-start items-center py-5 h-auto gap-y-2"
              style={{ minHeight: 120 }}
            >
              <div className="flex w-full justify-center items-center">
                <div
                  className="flex bg-white rounded-full border-2 justify-center items-center border-blue-300 px-2"
                  style={{
                    width: media.isMobile ? "100%" : 1000,
                    height: iconSize,
                  }}
                >
                  {media.isDesktopOrLaptop && (
                    <div className="flex w-1/12">
                      <Image
                        src={memberSettings?.companyLogo[0]?.url}
                        className=" rounded-full"
                        style={{ width: 65 }}
                        preview={false}
                      />
                    </div>
                  )}
                  <div className="flex px-4 w-full">
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
                  width: media.isMobile
                    ? "100%"
                    : media.isTablet
                    ? "90%"
                    : 1000,
                  height: media.isMobile ? "100%" : 100,
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
            <CurrentAddAsset />
          </Col> */}
        </Row>
      )}
    </div>
  );
};

export default Home;
