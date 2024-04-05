import React, { useContext, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { useEffect } from "react";
import { Skeleton } from "antd";
import { DotChartOutlined } from "@ant-design/icons";
import ComponetContainer from "../layout/ComponetContainer";
import { CurrentLoginContext } from "../context/CurrentLogin";
const DodutChart = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);

  const { media } = useContext(CurrentLoginContext);

  useEffect(() => {
    if (data?.length > 0) {
      setCurrentData(() => [...data]);
      setIsLoading(false);
    }
  }, [data]);

  const CurrentDonut = ({ pieData }) => (
    <ResponsivePie
      data={pieData}
      margin={{
        top: 20,
        right: 80,
        bottom: 20,
        left: 80,
      }}
      startAngle={-180}
      innerRadius={0.5}
      padAngle={1}
      cornerRadius={5}
      enableArcLinkLabels={true}
      activeOuterRadiusOffset={8}
      colors={{ scheme: "nivo" }}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", "0.1"]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color", modifiers: [] }}
      arcLabel="value"
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      // legends={
      //   media?.isDesktopOrLaptop
      //     ? [
      //         {
      //           anchor: "bottom",
      //           direction: "row",
      //           justify: false,
      //           translateX: 0,
      //           translateY: 56,
      //           itemsSpacing: 2,
      //           itemWidth: 100,
      //           itemHeight: 18,
      //           itemTextColor: "#999",
      //           itemDirection: "top-to-bottom",
      //           itemOpacity: 1,
      //           symbolSize: 18,
      //           symbolShape: "circle",
      //           effects: [
      //             {
      //               on: "hover",
      //               style: {
      //                 itemTextColor: "#000",
      //               },
      //             },
      //           ],
      //         },
      //       ]
      //     : []
      // }
    />
  );
  return (
    <>
      <ComponetContainer title="자산요약">
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
            <CurrentDonut pieData={currentData} />
          </div>
        )}
      </ComponetContainer>
    </>
  );
};

export default DodutChart;
