import { Input } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";

export const FilterBar = ({
  sections,
  originData,
  data,
  setData,
  setKeyword,
}) => {
  const [searchParams, setSearchParams] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const { media } = useContext(CurrentLoginContext);

  const buttonUnCheckStyle = "bg-gray-100 text-xs p-2 cursor-pointer";
  const buttonCheckStyle =
    "flex justify-center items-center text-xs px-2 bg-green-500 rounded-2xl h-7 text-gray-100 cursor-pointer";
  const handleReduceParamArray = (array, value) => {
    const index = array.indexOf(value);
    if (index === -1) {
      return [...array, value];
    } else {
      return array.filter((_, i) => i !== index);
    }
  };

  const handleSearchParams = (paramType, value) => {
    setSearchParams((prevParams) => {
      const updatedParams = {
        ...prevParams,
        [paramType]: handleReduceParamArray(prevParams[paramType] || [], value),
      };
      // 배열이 비어있으면 해당 키워드를 삭제
      if (updatedParams[paramType].length === 0) {
        delete updatedParams[paramType];
      }
      return updatedParams;
    });
  };

  useEffect(() => {
    let filteredData = originData.filter((item) =>
      Object.entries(searchParams).every(([key, value]) =>
        value.length > 0 ? value.includes(item[key]) : true
      )
    );

    if (searchKeyword.trim() === "") {
      filteredData = originData.filter((item) =>
        Object.entries(searchParams).every(([key, value]) =>
          value.length > 0 ? value.includes(item[key]) : true
        )
      );
    } else if (searchKeyword.trim() !== "") {
      filteredData = filteredData.filter((item) =>
        Object.keys(item).some((key) =>
          item[key]
            .toString()
            .toLowerCase()
            .includes(searchKeyword.toLowerCase())
        )
      );
    }

    setData(filteredData);
  }, [searchParams, searchKeyword]);

  useEffect(() => {
    setKeyword(searchKeyword);
  }, [searchKeyword]);

  return (
    <div className="flex w-full px-4 flex-col mb-5 ">
      {sections?.length > 0 &&
        sections.map((section, sIdx) => {
          return (
            <div className="flex w-full " key={section.title}>
              <div
                key={sIdx}
                className="flex h-atuo bg-gray-500 pl-4 justify-start items-center"
                style={{ width: "130px", minHeight: "45px" }}
              >
                <span className="font-semibold text-gray-100 text-xs">
                  {section.title}
                </span>
              </div>
              <div className="flex bg-gray-100 flex-wrap gap-2 px-4 justify-start items-center w-full">
                {section?.list?.length > 0 &&
                  section.list.map((item) => (
                    <button
                      key={item.value}
                      onClick={() =>
                        handleSearchParams(section.param, item.value)
                      }
                      className={
                        searchParams[section.param]?.includes(item.value)
                          ? buttonCheckStyle
                          : buttonUnCheckStyle
                      }
                    >
                      {item.value}
                    </button>
                  ))}
              </div>
            </div>
          );
        })}
      <div className="flex w-full" key="searchKeyword">
        <div
          className="flex bg-gray-500 pl-4 justify-start items-center"
          style={{ width: "130px", height: "55px" }}
        >
          <span className="font-semibold text-gray-100 text-xs">검색어</span>
        </div>
        <div
          className="flex bg-gray-100 flex-wrap gap-1 px-4 justify-start items-center w-full"
          style={{ height: "55px" }}
        >
          <Input.Search
            style={{ width: media.isMobile ? 230 : 300 }}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={(value) => setSearchKeyword(value)}
          />
        </div>
      </div>
    </div>
  );
};
