import React, { Children, useEffect, useState } from "react";
import { Skeleton } from "antd";
import { DotChartOutlined } from "@ant-design/icons";
import { ResponsiveSunburst } from "@nivo/sunburst";
import ComponetContainer from "../layout/ComponetContainer";

const SunburstChart = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState({});

  useEffect(() => {
    if (data?.length > 0) {
      setCurrentData(() => ({ name: "sun", children: [...data] }));
      setIsLoading(false);
    }
  }, [data]);

  const CurrentSunburst = ({ sunburstData /* see data tab */ }) => (
    <ResponsiveSunburst
      data={sunburstData}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      id="label"
      value="value"
      cornerRadius={4}
      borderColor={{ theme: "background" }}
      colors={{ scheme: "nivo" }}
      inheritColorFromParent={false}
      colorBy="id"
      childColor={{ theme: "grid.line.stroke" }}
      enableArcLabels={true}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 1.4]],
      }}
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
            <CurrentSunburst sunburstData={currentData} />
          </div>
        )}
      </ComponetContainer>
    </>
  );
};

export default SunburstChart;
