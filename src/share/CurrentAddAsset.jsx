import React, { useContext, useEffect, useState } from "react";
import ComponetContainer from "../layout/ComponetContainer";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { limit, orderBy, where } from "firebase/firestore";
import { Empty } from "antd";
import { ListWithFilterAndSearch } from "../widget/Index.js";
import { FaRegImage } from "react-icons/fa6";

const CurrentAddAsset = () => {
  const [currentList, setCurrentList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const assetQuery = useFirestoreQuery();
  const { memberSettings } = useContext(CurrentLoginContext);

  const fetchRecentAssets = async (ownerId) => {
    const condition = [where("assetOwner", "==", ownerId)];

    try {
      await assetQuery
        .getDocuments(
          "assets",
          (data) => {
            setCurrentList(() => [...data]);
            const items = handleListAssetItems(data);
            setItemList(() => items);
            console.log(data);
          },
          condition,
          "createdAt",
          "desc",
          2
        )
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (memberSettings?.id) {
      //console.log(memberSettings);
      fetchRecentAssets(memberSettings.userID);
    }
  }, [memberSettings]);

  const assetItem = [
    "assetName",
    "assetPics",
    "firstPics",
    "assetCode",
    "location",
    "currentUser",
  ];

  const newItel = {
    title: "",
    avatar: null,
    items: [{ key: 1, label: "위치", value: "location" }],
  };

  const handleListAssetItems = (data = []) => {
    if (data.length > 0) {
      const listItems = data.map((item, idx) => {
        const {
          assetName,
          assetPics,
          firstPics,
          assetCode,
          location,
          currentUser,
          createdeAtConverted,
        } = item;
        let avatarUrl = <FaRegImage />;
        if (firstPics?.length > 0) {
          avatarUrl = firstPics[0].url || <FaRegImage />;
        } else {
          if (assetPics?.length > 0) {
            avatarUrl = assetPics[0].url || <FaRegImage />;
          }
        }

        return {
          key: idx,
          avatar: avatarUrl,
          title: assetName,
          description: [
            { label: "일련번호", value: assetCode },
            { label: "위치", value: location },
            { label: "사용자", value: currentUser },
            { label: "등록일자", value: createdeAtConverted },
          ],
        };
      });

      console.log(listItems);
      return listItems;
    }
  };

  return (
    <ComponetContainer title="최근등록자산">
      {currentList?.length === 0 && (
        <Empty description="등록된 자산이 없습니다." />
      )}
      {currentList?.length > 0 && (
        <ListWithFilterAndSearch
          originalData={currentList}
          listItem={assetItem}
        />
      )}
    </ComponetContainer>
  );
};

export default CurrentAddAsset;
