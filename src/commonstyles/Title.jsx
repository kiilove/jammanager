import React from "react";
const basicFont = { fontFamily: "Noto Sans KR" };
export const ContentTitle = ({
  title,
  titleColor = "black",
  titleFontSize = "18px",
  padding = 5,
  marginBottom = 0,
}) => (
  <div className={`flex w-full p-${padding} mb-${marginBottom}`}>
    <span
      style={{
        ...basicFont,
        color: titleColor,
        fontSize: titleFontSize,
        fontWeight: "bold",
      }}
    >
      {title}
    </span>
  </div>
);
