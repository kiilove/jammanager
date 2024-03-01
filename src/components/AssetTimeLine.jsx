import { Card, Timeline } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  useFirestoreGetDocument,
  useFirestoreQuery,
} from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import { orderBy } from "lodash";

const AssetTimeLine = ({ assetDocuID }) => {
  const [timelineItems, setTimelineItems] = useState([]);
  const feedQuery = useFirestoreQuery();

  const convertTimestampToDate = (timestamp) => {
    if (!timestamp || typeof timestamp.seconds !== "number") {
      return "";
    }

    try {
      return new Date(timestamp.seconds * 1000).toISOString().split("T")[0];
    } catch (error) {
      console.error("Date conversion error:", error);
      return "";
    }
  };

  const makeFeedItem = (list = []) => {
    if (list.length > 0) {
      const items = list.map((item, iIdx) => {
        const { feedType, feedContext, pics, createAt, createBy, actionAt } =
          item;
        console.log(convertTimestampToDate(actionAt));
        let childColor = "blue";
        switch (feedType) {
          case "입고":
            childColor = "blue";
            break;
          case "수리":
            childColor = "red";

          case "배정":
            childColor = "green";
          default:
            break;
        }
        const label = convertTimestampToDate(actionAt);
        const children = feedContext;

        const newItem = {
          key: iIdx,
          label: label,
          children: children,
          color: childColor,
        };
        return newItem;
      });
      setTimelineItems(items);
    }
  };

  function sortByCreateAtDescending(arr) {
    // 배열을 createAt.seconds의 값에 따라 내림차순으로 정렬
    arr.sort((a, b) => b.createAt.seconds - a.createAt.seconds);
    return arr;
  }

  const fetchFeeds = async (id) => {
    const condition = [
      where("refAssetID", "==", id),
      orderBy("createAt", "desc"),
    ];
    try {
      await feedQuery.getDocuments(
        "assetFeeds",
        (data) => {
          console.log(data);
          makeFeedItem(
            data.sort((a, b) => b.createAt.seconds - a.createAt.seconds)
          );
        },
        condition
      );
    } catch (error) {}
  };
  useEffect(() => {
    console.log(assetDocuID);
    if (assetDocuID) {
      fetchFeeds(assetDocuID);
    }
  }, [assetDocuID]);

  return (
    <Card className="w-full">
      <Timeline items={timelineItems} mode="alternate" className="w-full" />
    </Card>
  );
};

export default AssetTimeLine;
