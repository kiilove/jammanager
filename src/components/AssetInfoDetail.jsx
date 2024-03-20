import React, { useContext, useEffect, useState } from "react";
import { convertTimestampToDate } from "../functions";
import { assetInfoFieldName, initDescription } from "../InitValues";
import { Col, ConfigProvider, Descriptions, Row } from "antd";
import { transform } from "lodash";
import { CurrentLoginContext } from "../context/CurrentLogin";

const AssetInfoDetail = ({ data, info, setInfo }) => {
  const [detailInfo, setDetailInfo] = useState({});
  const [descriptionItems, setDescriptionItems] = useState([]);
  const { media } = useContext(CurrentLoginContext);

  const transformTimestamps = (obj) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (value && typeof value === "object") {
        // 'seconds'가 숫자형이면 timestamp로 간주
        if (typeof value.seconds === "number") {
          // 현재 키에 'Converted'를 붙여 새로운 날짜 문자열 키를 추가
          obj[`${key}Converted`] = convertTimestampToDate(value);
          // 원래의 timestamp 키 삭제
          delete obj[key];
        } else {
          // 재귀적으로 내부 객체 변환
          transformTimestamps(value);
        }
      } else if (Array.isArray(value)) {
        // 배열 내부의 객체도 변환
        value.forEach((item) => transformTimestamps(item));
      }
    });
    return obj;
  };

  const findArrayKeysAtRoot = (obj) => {
    const arrayKeys = []; // 배열 값을 가지는 키들을 저장할 배열
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (Array.isArray(value)) {
        // 값이 배열인 경우, 키를 arrayKeys 배열에 추가
        arrayKeys.push(key);
      }
      // 중첩된 객체 내 배열은 무시하므로, 여기서는 추가적인 처리를 하지 않음
    });
    return arrayKeys;
  };

  const filterHidden = (obj) => {
    const hiddenKeyName = obj
      .filter((f) => f.hidden === true)
      .map((item, idx) => item.keyName);

    return hiddenKeyName;
  };
  const handleDescritionItems = (value) => {
    const detailField = [...assetInfoFieldName];

    const newValue = { ...value };

    const transformItems = transformTimestamps(newValue);
    const userInfo = newValue.userInfo;
    const arrayKeys = findArrayKeysAtRoot(transformItems);
    const hiddenKeys = filterHidden(assetInfoFieldName);

    const deleteTargetKeys = [
      ...arrayKeys,
      ...hiddenKeys,
      "firstPics",
      "userInfo",
    ];
    deleteTargetKeys.map((key, kIdx) => delete transformItems[key]);

    if (value.assetPurchasedType === "렌탈") {
      transformItems.assetRentalPeriodConverted = `${
        value.assetRentalPeriodConverted[0] || ""
      }-${value.assetRentalPeriodConverted[1] || ""}`;
    }

    if (value.isReturnDate) {
      transformItems.assetReturnDateConverted = value.assetReturnDateConverted;
    }
    const items = Object.keys(transformItems).map((key, kIdx) => {
      let children = transformItems[key];
      const value = assetInfoFieldName.find((f) => f.keyName === key);

      if (value?.valueType === "number") {
        children = children.toLocaleString();
      }

      if (value?.valueType === "boolean") {
        children = children === true ? "예" : "아니오";
      }
      if (value?.beforeAddon) {
        children = value.beforeAddon + " " + children;
      }

      if (value?.afterAddon) {
        children = children + " " + value.afterAddon;
      }

      const item = {
        key: kIdx,
        label: value?.label || key,
        children,

        index: value?.index || 1000,
        span: value?.span || 1,
        valueType: value?.valueType || "text",
      };
      return item;
    });

    if (value.assetPurchasedType === "렌탈") {
      items.push({
        key: items.length + 1,
        label: "",
        children: "",
        index: 2000,
        span: 1,
      });
    }
    items.push(
      {
        key: items.length + 1,
        label: "부서",
        children: userInfo.userDepartment || "",
        index: 100,
        span: 1,
      },
      {
        key: items.length + 1,
        label: "사용자",
        children:
          userInfo?.userName === "미지정"
            ? "미지정"
            : userInfo?.userName +
                `(${userInfo?.userSpot || ""} ${userInfo?.userRank || ""})` ||
              "",
        index: 101,
        span: 1,
      }
    );

    setDescriptionItems(items.sort((a, b) => a.index - b.index));
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    handleDescritionItems(data);
  }, [data]);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 12,
          fontSizeLG: 14,
        },
      }}
    >
      <Descriptions
        items={descriptionItems}
        column={3}
        size="small"
        bordered={media.isDesktopOrLaptop}
        layout={media.isDesktopOrLaptop ? "horizontal" : "vertical"}
      />
    </ConfigProvider>
  );
};

export default AssetInfoDetail;
