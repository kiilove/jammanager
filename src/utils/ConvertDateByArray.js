import React from "react";

const convertTimestampToDate = (timestamp) => {
  if (!timestamp || typeof timestamp.seconds !== "number") {
    return "";
  }

  try {
    const date = new Date(timestamp.seconds * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  } catch (error) {
    console.error("Date conversion error:", error);
    return "";
  }
};

export const ConvertDateByArray = (data = []) => {
  return data.map((item) => {
    const newItem = { ...item };

    Object.keys(item).forEach((key) => {
      const value = item[key];
      if (
        value &&
        typeof value === "object" &&
        "seconds" in value &&
        typeof value.seconds === "number"
      ) {
        const convertedDate = convertTimestampToDate(value);
        newItem[`${key}Converted`] = convertedDate;
      }
    });

    return newItem;
  });
};
