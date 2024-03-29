import { Card, Timeline } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  useFirestoreGetDocument,
  useFirestoreQuery,
} from "../hooks/useFirestore";
import { where } from "firebase/firestore";
import { orderBy } from "lodash";
import { convertTimestampToDate } from "../functions";

const AssetTimeLine = ({ assetDocuID }) => {
  const [timelineItems, setTimelineItems] = useState([]);
  const feedQuery = useFirestoreQuery();

  const makeFeedItem = (list = []) => {
    if (list.length > 0) {
      const items = list.map((item, iIdx) => {
        const {
          feedType,
          feedContext,
          pics,
          createdAtConverted,
          createdBy,
          actionAtConverted,
        } = item;

        let childColor = "blue";
        switch (feedType) {
          case "입고":
            childColor = "blue";
            break;
          case "수리":
            childColor = "red";
          case "자산수정":
            childColor = "gray";
            break;

          case "배정":
            childColor = "green";
          default:
            break;
        }
        const label = actionAtConverted;
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
            data.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
          );
        },
        condition
      );
    } catch (error) {}
  };
  useEffect(() => {
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
