import React, { Children, useEffect, useState } from "react";
import { Skeleton } from "antd";
import { DotChartOutlined } from "@ant-design/icons";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import ComponetContainer from "../layout/ComponetContainer";

const CirclePackingChart = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState({});

  useEffect(() => {
    if (data?.length > 0) {
      setCurrentData(() => ({ name: "sun", children: [...data] }));
      setIsLoading(false);
    }
  }, [data]);

  const CurrentCirclePacking = ({ circlePackingData /* see data tab */ }) => (
    <ResponsiveCirclePacking
      data={circlePackingData}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      id="label"
      value="value"
      colors={{ scheme: "nivo" }}
      childColor={{
        from: "color",
        modifiers: [["brighter", 0.4]],
      }}
      padding={4}
      enableLabels={true}
      labelsFilter={(n) => 2 === n.node.depth}
      labelsSkipRadius={10}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.5]],
      }}
      defs={[
        {
          id: "lines",
          type: "patternLines",
          background: "none",
          color: "inherit",
          rotation: -45,
          lineWidth: 5,
          spacing: 8,
        },
      ]}
      fill={[
        {
          match: {
            depth: 1,
          },
        },
      ]}
    />
  );
  return (
    <>
      <ComponetContainer title="분류별 분포">
        {isLoading && (
          <div className="flex w-full h-full justify-center items-center ">
            <Skeleton.Node active={isLoading} className="w-full h-full">
              <DotChartOutlined
                style={{
                  fontSize: 40,
                  color: "#bfbfbf",
                }}
              />
            </Skeleton.Node>
          </div>
        )}
        {!isLoading && (
          <div
            className="flex w-full h-full justify-center items-center "
            style={{ width: "100%", height: 250 }}
          >
            <CurrentCirclePacking circlePackingData={currentData} />
          </div>
        )}
      </ComponetContainer>
    </>
  );
};

export default CirclePackingChart;
