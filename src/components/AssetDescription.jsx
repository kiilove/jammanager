import React from "react";
import { initDescription } from "../InitValues";

const AssetDescription = ({ propProductLine }) => {
  const description = initDescription.find(
    (f) => f.propProductLine === propProductLine
  );
  console.log(description);
  return <div>AssetDescription</div>;
};

export default AssetDescription;
