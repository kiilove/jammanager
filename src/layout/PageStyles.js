import { Spin } from "antd";

export const pageTailWind = "flex w-full h-full rounded-lg bg-white p-4";
export const pageTailWindMobile = "flex w-full h-full rounded-lg p-1";

export const pageInlineStyle = { minHeight: "500px" };
export const pageContentContainerTailWind =
  "flex flex-col w-full h-full justify-start items-center";

export const IsLoadingDiv = () => (
  <div className="flex w-full h-full justify-center items-center">
    <Spin />
  </div>
);
