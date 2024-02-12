import React, { useEffect, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { useNavigate } from "react-router-dom";
import { Card, Modal, Space, Spin } from "antd";
import _ from "lodash";
import { encodeDate, handleFilterdArray } from "../functions";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { BarcodeOutlined, QrcodeOutlined } from "@ant-design/icons";

const BlockList = () => {
  const [groups, setGroups] = useState([]);
  const [modalOpen, setModalOpen] = useState({
    barcode: { open: false, data: "" },
    qrcode: { open: false, data: "" },
  });
  const [basicData, setBasicData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hookError, setHookError] = useState(null);
  const firebaseQuery = useFirestoreQuery();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      await firebaseQuery.getDocuments("transplanting", (data) => {
        setGroups(data);
      });
      await firebaseQuery.getDocuments("basicdata", (data) => {
        setBasicData({ ...data[0] });
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(groups);
  }, [groups]);

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
          <div className="flex w-full h-full flex-wrap box-border gap-4 justify-center items-center">
            {basicData?.blocks?.length > 0 ? (
              basicData.blocks.map((block, bIdx) => {
                const { blockName } = block;
                const currentData = handleFilterdArray(
                  groups,
                  "transplantingBlock",
                  blockName
                );
                console.log(currentData);

                return (
                  <Card
                    title={blockName}
                    style={{
                      width: "100%",
                      minWidth: "250px",
                      maxWidth: "450px",
                      height: "100%",
                      minHeight: "350px",
                      maxHeight: "550px",
                    }}
                  >
                    <Space>
                      {currentData?.length > 0 ? (
                        currentData.map((data, dIdx) => {
                          const {
                            transplantingBarCode,
                            transplantingBlock,
                            transplantingDate,
                            transplantingTreeCount,
                            sowing,
                          } = data;

                          const { seedSowingDate, seedName } = sowing;
                          const timestamp = new Timestamp(
                            seedSowingDate.seconds,
                            seedSowingDate.nanoseconds
                          );
                          return (
                            <Card
                              type="inner"
                              title={transplantingBarCode}
                              actions={[
                                <BarcodeOutlined
                                  key="barcode"
                                  style={{ fontSize: 15 }}
                                  onClick={() => {
                                    navigate("/barcodecreator", {
                                      state: {
                                        barcodeValue: transplantingBarCode,
                                        barcodeCount: transplantingTreeCount,
                                      },
                                    });
                                  }}
                                />,
                                <QrcodeOutlined
                                  key="qrcode"
                                  style={{ fontSize: 15 }}
                                />,
                              ]}
                            >
                              <div className="flex w-full flex-col gap-y-1">
                                <span>
                                  파종일자:
                                  <span className="ml-1">
                                    {encodeDate(seedSowingDate)}
                                  </span>
                                </span>
                                <span>
                                  이식일자:
                                  <span className="ml-1">
                                    {encodeDate(transplantingDate)}
                                  </span>
                                </span>
                                <span>
                                  최초개체수:
                                  <span className="ml-1">
                                    {transplantingTreeCount
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </span>
                                </span>
                                <span>
                                  현재개체수:
                                  <span className="ml-1">
                                    {transplantingTreeCount
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </span>
                                </span>
                              </div>
                            </Card>
                          );
                        })
                      ) : (
                        <div></div>
                      )}
                    </Space>
                  </Card>
                );
              })
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BlockList;
