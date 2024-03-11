import React from "react";
import { useEffect } from "react";
import { navigateMenus } from "../navigate";
import { Breadcrumb } from "antd";

const PageBreadCrumb = ({ pathname }) => {
  const handleBreadCrumb = (path) => {
    let parents = [];
    const currentPathInfo = navigateMenus.find((f) => f.link === path);
    const parentPaths = navigateMenus
      .filter((f) => f.key === currentPathInfo.parentKey)
      .sort((a, b) => a.index - b.index);
    if (parentPaths.length > 0) {
      parents = parentPaths.map((item, iIdx) => {
        return { href: item.link, title: item.label };
      });
    }
    const items = [
      { href: "/", title: "홈" },
      ...parents,
      { title: currentPathInfo.label, className: "font-semibold" },
    ];

    return items;
  };
  useEffect(() => {
    if (pathname) {
      //handleBreadCrumb(pathname);
      console.log(handleBreadCrumb(pathname));
    }
  }, [pathname]);

  return (
    <div
      className="flex w-full"
      style={{ height: "auto", fontFamily: "Noto Sans" }}
    >
      <Breadcrumb
        items={handleBreadCrumb(pathname)}
        style={{ fontFamily: "Noto Sans" }}
      />
    </div>
  );
};

export default PageBreadCrumb;
