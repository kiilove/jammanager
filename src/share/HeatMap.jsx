import React from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
const HeatMap = () => {
  const CurrentHeatMap = ({ data /* see data tab */ }) => (
    <ResponsiveHeatMap
      data={data}
      margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
      xOuterPadding={0.15}
      xInnerPadding={0.15}
      yOuterPadding={0.15}
      yInnerPadding={0.15}
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -90,
        legend: "",
        legendOffset: 46,
        truncateTickAt: 0,
      }}
      axisRight={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "country",
        legendPosition: "middle",
        legendOffset: 70,
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "country",
        legendPosition: "middle",
        legendOffset: -72,
        truncateTickAt: 0,
      }}
      colors={{
        type: "sequential",
        scheme: "greens",
        minValue: -100000,
        maxValue: 100000,
      }}
      emptyColor="#555555"
      borderRadius={5}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.8]],
      }}
      legends={[
        {
          anchor: "bottom",
          translateX: 0,
          translateY: 30,
          length: 400,
          thickness: 8,
          direction: "row",
          tickPosition: "after",
          tickSize: 3,
          tickSpacing: 4,
          tickOverlap: false,
          tickFormat: " >-.2s",
          title: "Value →",
          titleAlign: "start",
          titleOffset: 4,
        },
      ]}
      motionConfig="slow"
    />
  );
  return <div>HeatMap</div>;
};

export default HeatMap;
