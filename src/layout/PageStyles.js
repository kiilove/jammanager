import { Spin } from "antd";

export const pageTailWind =
  "flex w-full h-full rounded-lg bg-white p-4 justify-center items-start";
export const pageTailWindMobile = "flex w-full h-full rounded-lg p-1 bg-white";

export const pageInlineStyle = { minHeight: "500px" };

export const componentTailWind =
  "flex w-full h-full rounded-lg bg-white p-2 justify-center items-start";
export const componentTailWindMobile =
  "flex w-full h-full rounded-lg p-1 bg-white";

export const componentInlineStyle = { minHeight: "500px" };

export const pageContentContainerTailWind =
  "flex flex-col w-full h-full justify-start items-center bg-red-200";

export const IsLoadingDiv = () => (
  <div className="flex w-full h-full justify-center items-center">
    <Spin />
  </div>
);
