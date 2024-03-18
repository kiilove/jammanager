import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ContentTitle } from "../commonstyles/Title";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  Slider,
  Space,
  Switch,
  Tag,
} from "antd";
import {
  CloseCircleOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { AssetPrintTiny } from "./AssetPrintTiny";
import ReactToPrint from "react-to-print";

const AssetCodePrint = () => {
  const [assets, setAssets] = useState([]);
  const [tags, setTags] = useState([]);
  const [printType, setPrintType] = useState("tiny");
  const [paperSize, setPaperSize] = useState("A4");
  const [paperMarginX, setPaperMarginX] = useState(5);
  const [paperMarginY, setPaperMarginY] = useState(5);
  const [paperGap, setPaperGap] = useState(1);
  const [paperCustomSizeHorizontal, setPaperCustomHorizontal] = useState("");
  const [paperCustomSizeVertical, setPaperCustomVertical] = useState("");
  const [paperDirection, setPaperDirection] = useState("vertical");
  const [printBorder, setPrintBorder] = useState(true);
  const [scaleValue, setScaleValue] = useState(3); // 초기 스케일 값을 0.5로 설정
  const [showSettings, setShowSettings] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const location = useLocation();
  const printRef = useRef();

  // 용지 크기와 스케일에 따른 스타일 계산
  const calculatePaperStyle = () => {
    const originalWidthMM = 210; // A4 기본 가로 mm
    const originalHeightMM = 297; // A4 기본 세로 mm
    let width = originalWidthMM;
    let height = originalHeightMM;

    if (paperSize === "A3") {
      width = 297;
      height = 420;
    } else if (paperSize === "custom") {
      width = parseFloat(paperCustomSizeHorizontal);
      height = parseFloat(paperCustomSizeVertical);
    }

    if (paperDirection === "horizontal") {
      [width, height] = [height, width];
    }

    // 실제 크기에 스케일 적용
    const scaledWidth = width * scaleValue + "mm";
    const scaledHeight = height * scaleValue + "mm";

    return {
      width: `${originalWidthMM}mm`,
      height: `${originalHeightMM}mm`,
      overflow: "auto",
      backgroundColor: "white",
    };
  };

  useEffect(() => {
    if (location?.state?.data) {
      setAssets([...location.state.data]);
      const initTags = location.state.data.map((d) => {
        return { code: d.assetCode, id: d.id };
      });
      setTags([...initTags]);
    }
  }, [location]);

  const paperStyle = calculatePaperStyle();
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handlePrintClick = () => {
    setIsPrinting(true); // 인쇄 버튼 클릭 시 isPrinting 상태를 true로 설정
  };

  return (
    <div className="flex w-full justify-center items-start">
      <div
        className="flex w-full h-full flex-col rounded-lg"
        style={{ backgroundColor: "#fff", minHeight: "100%" }}
      >
        <div className="flex w-full">
          <ContentTitle title="자산코드인쇄" />

          {/* <div className="flex justify-center items-center flex-col">
            <span>미리보기 배율 </span>
            <Slider
              min={0.5}
              max={2}
              step={0.1}
              value={scaleValue}
              onChange={setScaleValue}
              style={{ width: 150 }}
            />
          </div> */}
          <Button
            type="default"
            onClick={toggleSettings}
            style={{ margin: "16px" }}
          >
            {showSettings ? (
              <>
                <UpOutlined /> 설정 숨기기
              </>
            ) : (
              <>
                <DownOutlined /> 설정 표시하기
              </>
            )}
          </Button>
          <ReactToPrint
            trigger={() => (
              <Button type="default" style={{ margin: "16px" }}>
                인쇄
              </Button>
            )}
            content={() => printRef.current}
          />
        </div>

        <div className="flex w-full px-4 flex-col mb-5  h-full">
          {showSettings && (
            <>
              <div className="flex h-full w-full bg-gray-500">
                <div
                  className="flex bg-gray-500 pl-4 justify-start items-center"
                  style={{ width: "130px", height: "100%", minHeight: 55 }}
                >
                  <span className="font-semibold text-gray-100 text-xs">
                    인쇄설정
                  </span>
                </div>
                <div
                  className="flex bg-gray-100 w-full justify-start items-center p-5 gap-3 flex-wrap"
                  style={{ height: "100%", minHeight: 55 }}
                >
                  <Radio.Group
                    value={printType}
                    options={[
                      { key: 1, label: "QR만인쇄", value: "tiny" },
                      { key: 2, label: "간략인쇄", value: "small" },
                      { key: 3, label: "상세인쇄", value: "middle" },
                    ]}
                    optionType="button"
                    buttonStyle="solid"
                  />
                  {/* <Radio.Group
                    value={paperSize}
                    onChange={(e) => {
                      setPaperSize(e.target.value);
                    }}
                    options={[
                      { key: 1, label: "A4", value: "A4" },
                      { key: 3, label: "직접입력", value: "custom" },
                    ]}
                    optionType="button"
                    buttonStyle="solid"
                  />
                  <Space className={paperSize !== "custom" && "hidden"}>
                    <Input
                      style={{ width: 75 }}
                      onChange={(e) => setPaperCustomHorizontal(e.target.value)}
                      placeholder="가로(㎜)"
                      className=" placeholder:text-xs placeholder:text-gray-600"
                    />
                    <span>×</span>
                    <Input
                      style={{ width: 75 }}
                      onChange={(e) => setPaperCustomVertical(e.target.value)}
                      placeholder="세로(㎜)"
                      className=" placeholder:text-xs placeholder:text-gray-600"
                    />
                  </Space>
                  <Radio.Group
                    value={paperDirection}
                    onChange={(e) => setPaperDirection(e.target.value)}
                    options={[
                      { key: 1, label: "세로", value: "vertical" },
                      { key: 2, label: "가로", value: "horizontal" },
                    ]}
                    optionType="button"
                    buttonStyle="solid"
                  /> */}
                  <Space className="ml-2">
                    <span>칼선인쇄</span>
                    <Switch checked={printBorder} onChange={setPrintBorder} />
                  </Space>
                  <Space className="ml-2">
                    <span>좌우여백(㎜)</span>
                    <InputNumber
                      min={0}
                      max={20}
                      step={"0.1"}
                      value={paperMarginX}
                      style={{ width: 65 }}
                      onChange={(value) => setPaperMarginX(value)}
                    />
                    <span>상하여백(㎜)</span>
                    <InputNumber
                      min={0}
                      max={20}
                      step={"0.1"}
                      style={{ width: 65 }}
                      value={paperMarginY}
                      onChange={(value) => setPaperMarginY(value)}
                    />
                    <span>간격(㎜)</span>
                    <InputNumber
                      min={0.1}
                      max={20}
                      step={"0.1"}
                      style={{ width: 65 }}
                      value={paperGap}
                      onChange={(value) => setPaperGap(value)}
                    />
                    <span>QR박스크기(㎝)</span>
                    <InputNumber
                      min={3}
                      max={10}
                      style={{ width: 65 }}
                      step={"0.1"}
                      value={scaleValue}
                      onChange={(value) => setScaleValue(value)}
                    />
                  </Space>
                </div>
              </div>
              {/* <div className="flex h-full w-full bg-gray-500">
                <div
                  className="flex bg-gray-500 pl-4 justify-start items-center"
                  style={{ width: "130px", height: "100%", minHeight: 55 }}
                >
                  <span className="font-semibold text-gray-100 text-xs">
                    출력대상
                  </span>
                </div>
                <div
                  className="flex flex-wrap bg-gray-100 w-full justify-start items-center p-5 gap-3"
                  style={{ height: "100%", minHeight: 55 }}
                >
                  {tags.length > 0 &&
                    tags.map((tag, tIdx) => {
                      return (
                        <div
                          className="flex justify-center items-center px-2 gap-2 rounded bg-gray-200"
                          style={{ width: "auto", fontSize: 11, height: 20 }}
                        >
                          <span>{tag.code}</span>
                          <button
                            id={tIdx}
                            className="flex justify-center items-center"
                            style={{ height: 20 }}
                          >
                            <CloseCircleOutlined style={{ fontSize: 11 }} />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div> */}
            </>
          )}

          <div className="flex w-full flex-col h-full">
            {/* 인쇄 설정 및 출력대상 관련 컴포넌트 */}
            <div className="flex w-full h-full justify-start items-center flex-col bg-gray-100 p-5">
              <div
                className="flex justify-center items-start p-0"
                style={{ overflow: "auto", width: "100%", height: "650px" }}
              >
                <div
                  ref={printRef}
                  style={paperStyle}
                  className="flex flex-wrap justify-center items-start"
                >
                  <div
                    className={`flex w-full flex-wrap  justify-center items-start `}
                    style={{
                      marginTop: `${paperMarginY}mm`,
                      marginBottom: `${paperMarginY}mm`,
                      marginLeft: `${paperMarginX}mm`,
                      marginRight: `${paperMarginX}mm`,
                      gap: paperGap * 3.77,
                    }}
                  >
                    {printType === "tiny" &&
                      tags.map((tag, tIdx) =>
                        printBorder ? (
                          <div
                            className="flex"
                            style={{ border: "1px dashed #8a8a8a" }}
                          >
                            <AssetPrintTiny
                              data={tag}
                              scale={scaleValue}
                              printBorder={printBorder}
                            />
                          </div>
                        ) : (
                          <AssetPrintTiny data={tag} scale={scaleValue} />
                        )
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCodePrint;
