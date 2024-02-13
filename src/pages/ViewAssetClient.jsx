import {
  Button,
  ConfigProvider,
  Descriptions,
  QRCode,
  Spin,
  notification,
} from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFirestoreGetDocument } from "../hooks/useFirestore";
import { assetInfoFieldName } from "../InitValues";
import dayjs from "dayjs";
import { groupByKey } from "../functions";

const ViewAssetClient = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assetItems, setAssetItems] = useState([]);
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const assetDocumentGet = useFirestoreGetDocument();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    apiType,
    title,
    message,
    placement,
    duration,
    maxCount
  ) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
      maxCount,
    });
  };
  const downloadQRCode = (assetCode) => {
    const canvas = document.getElementById("qrcode")?.querySelector("canvas");
    if (canvas) {
      // 새 캔버스 생성
      const newCanvas = document.createElement("canvas");
      const context = newCanvas.getContext("2d");

      // 여백 설정 (예: 20px)
      const padding = 20;
      // 새 캔버스의 크기를 원본 QR 코드 캔버스 크기 + 여백으로 설정
      newCanvas.width = canvas.width + padding * 2;
      newCanvas.height = canvas.height + padding * 2;

      // 배경을 흰색으로 설정
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, newCanvas.width, newCanvas.height);

      // 원본 QR 코드 이미지를 새 캔버스에 그리기 (여백을 고려하여 위치 조정)
      context.drawImage(canvas, padding, padding);

      // 새 캔버스의 이미지 데이터를 URL로 변환
      const url = newCanvas.toDataURL();

      // 다운로드 링크 생성 및 클릭 이벤트 실행
      const a = document.createElement("a");
      a.download = `${assetCode}.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const fetchAsset = async (id) => {
    try {
      assetDocumentGet.getDocument("assets", id, (data) => {
        console.log(data);
        if (!data) {
          openNotification(
            "error",
            "데이터오류",
            "자산정보를 불러오지 못했습니다.",
            "top",
            3
          );
        } else {
          const descriptionItems = Object.keys(data).map((item, iIdx) => {
            let value = data[item];

            // Check if the item is a Timestamp object and convert
            if (value && typeof value.toDate === "function") {
              value = dayjs(value.toDate()).format("YYYY-MM-DD");
            }

            // Special handling for 'firstPics' key
            if (
              item === "firstPics" &&
              Array.isArray(value) &&
              value.length > 0
            ) {
              value = (
                <div className="flex w-full justify-center">
                  <img
                    src={value[0].url}
                    alt="Asset"
                    style={{ maxWidth: "100px", maxHeight: "200px" }}
                  />
                </div>
              );
            }

            const fieldInfo =
              assetInfoFieldName.find((f) => f.keyName === item) || {};
            const newItem = {
              key: iIdx,
              label: fieldInfo.label || item,
              children: value,
              index: fieldInfo.index || 0,
              isHidden: fieldInfo.hidden || false,
              type: fieldInfo.type,
            };
            return newItem;
          });
          descriptionItems.sort((a, b) => a.index - b.index);

          const qrItem = {
            key: 1000,
            label: "QR코드",
            children: (
              <div
                id="qrcode"
                className="flex w-auto justify-center flex-col gap-y-2"
              >
                <div className="flex w-full justify-center">
                  <QRCode
                    value={`https://jncore-asset.web.app/cc815a57-69fb-4e29-a6f6-e8e7cfe8de66/${data.id}`}
                    bgColor="#fff"
                  />
                </div>
                <div className="flex justify-center ">
                  <Button
                    className="w-40 bg-blue-500"
                    type="primary"
                    onClick={() => downloadQRCode(data.assetCode)}
                  >
                    다운로드
                  </Button>
                </div>
              </div>
            ),
            index: 1,
            isHidden: false,
            type: "자산",
            span: 1,
          };
          descriptionItems.push({ ...qrItem });
          console.log(descriptionItems);

          const descriptionType = groupByKey(
            descriptionItems.filter((f) => f.isHidden === false),
            "type"
          );

          const groupByType = descriptionType.map((d) => {
            const filtered = descriptionItems
              .filter((f) => f.type === d.value)
              .filter((f) => f.isHidden === false)
              .sort((a, b) => a.index - b.index);

            return filtered;
          });

          console.log(groupByType);

          setAssetItems(() => [...groupByType]);
          setIsLoading(false);
        }
      });
    } catch (error) {
      openNotification(
        "error",
        "데이터오류",
        "자산정보를 불러오지 못했습니다.",
        "top",
        3
      );
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(params);
    if (params?.assetCode) {
      fetchAsset(params.assetCode);
    }
  }, [params]);

  return (
    <>
      {isLoading && (
        <div className="flex w-full h-screen justify-center items-center">
          <Spin />
        </div>
      )}
      {!isLoading && assetItems.length > 0 && (
        <div className="flex w-full h-full justify-center items-center bg-white rounded-lg p-4 flex-col gap-y-2">
          <ConfigProvider
            theme={{
              components: {
                Descriptions: {
                  labelBg: "rgba(0, 0, 0, 0.08)",
                },
              },
            }}
          >
            <Descriptions
              title="자산정보"
              layout="vertical"
              items={assetItems[0]}
              bordered
              className="w-full"
              size="small"
            />
            <Descriptions
              layout="vertical"
              items={assetItems[1]}
              bordered
              className="w-full"
              size="small"
            />
            <Descriptions
              title="거래정보"
              layout="vertical"
              items={assetItems[2]}
              bordered
              className="w-full"
              size="small"
            />
            <Descriptions
              title="사용자정보"
              layout="vertical"
              items={assetItems[3]}
              bordered
              className="w-full"
              size="small"
            />
          </ConfigProvider>
        </div>
      )}
      {contextHolder}
    </>
  );
};

export default ViewAssetClient;
