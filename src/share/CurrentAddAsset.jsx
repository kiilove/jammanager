import React, { useContext, useEffect } from "react";
import ComponetContainer from "../layout/ComponetContainer";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { limit, orderBy, where } from "firebase/firestore";

const CurrentAddAsset = () => {
  const assetQuery = useFirestoreQuery();
  const { memberSettings } = useContext(CurrentLoginContext);

  // const fetchRecentAssets = async (ownerId) => {
  //   const condition = [
  //     where("assetOwner", "==", ownerId),
  //     orderBy("createdAt", "desc"),
  //     limit(5),
  //   ];

  //   try {
  //     await assetQuery
  //       .getDocuments(
  //         "assets",
  //         (data) => {
  //           console.log(data);
  //         },
  //         condition
  //       )
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (memberSettings?.id) {
      console.log(memberSettings);
      //fetchRecentAssets(memberSettings.userID);
    }
  }, [memberSettings]);

  return <ComponetContainer title="최근등록자산"></ComponetContainer>;
};

export default CurrentAddAsset;
