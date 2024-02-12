import React from "react";
const basicFont = { fontFamily: "Noto Sans KR" };
export const ContentTitle = ({
  title,
  titleColor = "black",
  titleFontSize = "18px",
}) => (
  <div className="flex w-full h-20 p-5">
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
