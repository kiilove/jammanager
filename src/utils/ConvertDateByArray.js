import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
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

export const ConvertDateToTimestampAndConverted = (date) => {
  const dateToTimestamp = Timestamp.fromDate(date.toDate());
  const dateToConverted = convertTimestampToDate(dateToTimestamp);

  return { dateToTimestamp, dateToConverted };
};

export const ConvertTimestampToDateByArray = (data = []) => {
  const processedData = [...data];
  return processedData.map((item) => {
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

export const ConvertDateToTimestampByObject = (data = {}) => {
  //함수 오류있는듯 아직 사용하지 마시오.
  const processedData = { ...data };
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

  Object.keys(processedData).forEach((key) => {
    const value = processedData[key];
    console.log(key, iso8601Regex.test(value));
    if (Array.isArray(value) && value.length > 0 && dayjs(value[0]).isValid()) {
      // 배열 내 날짜 데이터를 처리합니다. 배열의 모든 항목이 날짜 데이터인지 확인하지 않습니다.
      processedData[key] = value.map((dateStr) =>
        Timestamp.fromDate(new Date(dateStr))
      );
      processedData[`${key}Converted`] = value.map((dateStr) =>
        dayjs(dateStr).format("YYYY-MM-DD")
      );
    } else if (typeof value === "string" && dayjs(value).isValid()) {
      // 문자열 날짜 데이터를 처리합니다.
      processedData[key] = Timestamp.fromDate(new Date(value));
      processedData[`${key}Converted`] = dayjs(value).format("YYYY-MM-DD");
    }
    // 날짜 형식이 아닌 데이터는 변환하지 않고 그대로 유지합니다.
  });

  return processedData;
};
