import React, { useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { useEffect } from "react";
import { Button, Card, Spin, Tooltip } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  DeleteRowOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const SowingList = () => {
  const [sowings, setSowings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hookError, setHookError] = useState(null);
  const firebaseQuery = useFirestoreQuery();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      await firebaseQuery.getDocuments("sowings", (data) => {
        setSowings(data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(sowings);
  }, [sowings]);

  useEffect(() => {
    setIsLoading(firebaseQuery.loading);
  }, [firebaseQuery.loading]);

  useEffect(() => {
    if (firebaseQuery.error !== null) {
      console.log(firebaseQuery.error);
    }
  }, [firebaseQuery.error]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="w-full h-full flex justify-center items-center">
          <Spin />
        </div>
      )}
      {!isLoading && (
        <div className="w-full h-full flex justify-center items-center">
          {sowings?.length > 0 ? (
            <div className="w-full h-full flex flex-wrap box-border gap-4">
              {sowings.map((sowing, sIdx) => {
                const {
                  id,
                  isActive,
                  seedSowing,
                  seedSowingType,
                  seedName,
                  seedProjectName,
                  seedPurchaseOfficeName,
                  seedSowingDate,
                } = sowing;
                const startDate = new Date(seedSowingDate.toDate());
                const endDate = new Date();
                const timeDiff = endDate - startDate;

                const dayDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
                console.log(dayDiff);

                return (
                  <Card
                    title={seedProjectName}
                    style={{ width: "100%", maxWidth: "250px" }}
                    actions={[
                      <Tooltip title="이식">
                        <DeleteRowOutlined
                          key="setting"
                          onClick={() =>
                            navigate("/newtransplanting", {
                              state: {
                                sowingId: id,
                                prevData: { ...sowing, dayDiff: dayDiff },
                              },
                            })
                          }
                        />
                      </Tooltip>,
                      <Tooltip title="파종수정">
                        <EditOutlined key="edit" />
                      </Tooltip>,
                      <Tooltip title="더보기">
                        <EllipsisOutlined key="ellipsis" />
                      </Tooltip>,
                    ]}
                  >
                    <div className="flex w-full justify-start items-start flex-col gap-y-2">
                      <span>
                        파종일 :{" "}
                        {dayjs(seedSowingDate.toDate()).format("YYYY-MM-DD")}
                      </span>
                      <span>
                        파종 :{" "}
                        {seedSowing
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        <span>{seedSowingType === "weight" ? "kg" : "개"}</span>
                      </span>
                      <span>종자명 : {seedName}</span>
                      <span>매입처 : {seedPurchaseOfficeName}</span>
                      <span>상태 : {isActive ? "육종중" : "이식"}</span>
                      <span>파종후 {dayDiff}일 경과</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div>파종 데이터가 없습니다.</div>
          )}
        </div>
      )}
    </>
  );
};

export default SowingList;
