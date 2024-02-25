import {
  Button,
  Col,
  Collapse,
  Image,
  QRCode,
  Row,
  Space,
  notification,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { assetInfoFieldName } from "../InitValues";
import { calcDepreciation } from "../functions";
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";

const AssetView = ({ data }) => {
  const [currentAssetPic, setCurrentAssetPic] = useState();
  const [assetPicList, setAssetPicList] = useState([]);
  const [collapseItems, setCollapseItems] = useState([]);
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

  const handleQRcode = (id) => {
    return (
      <div id="qrcode">
        <QRCode
          value={`https://jncore-asset.web.app/cc815a57-69fb-4e29-a6f6-e8e7cfe8de66/${id}`}
          bgColor="#fff"
          size={700}
          style={{ padding: 2 }}
        />
      </div>
    );
  };

  const renderQRCode = () => {
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
      const url = newCanvas.toDataURL();
      return url;
    }
  };

  useEffect(() => {
    if (!data) {
      openNotification(
        "error",
        "데이터오류",
        "자산정보를 불러오지 못했습니다.",
        "top",
        3
      );
    } else {
      if (data?.firstPics?.length > 0) {
        console.log(data.firstPics[0]);

        setCurrentAssetPic(() => data.firstPics[0].url);
        const picUrls = data.firstPics.map((pic, pIdx) => {
          const { url } = pic;

          return url;
        });
        setAssetPicList(() => [...picUrls, renderQRCode(data.id)]);
      } else {
        setAssetPicList(() => [renderQRCode(data.id)]);
      }
    }

    handleQRcode(data.id, data.assetCode);
  }, [data]);

  return (
    <>
      <Row>
        <Col span={12}>
          <Row justify="start" gutter={[0, 16]}>
            <Col span={24}>
              <div className="flex w-full h-full justify-center items-center ">
                <Image.PreviewGroup items={[...assetPicList]}>
                  <Image
                    width={150}
                    src={currentAssetPic}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                    preview={true}
                  />
                </Image.PreviewGroup>
              </div>
            </Col>

            <Col span={24}>
              <div className="flex gap-1">
                {assetPicList.length > 0 &&
                  assetPicList.map((url, uIdx) => (
                    <>
                      <Image
                        src={url}
                        width={45}
                        preview={false}
                        key={uIdx}
                        className=" rounded-lg cursor-pointer"
                        style={{ border: "1px solid #dfdfdf", padding: 2 }}
                        onClick={() => setCurrentAssetPic(() => url)}
                      />
                    </>
                  ))}
                <div className="hidden">
                  {handleQRcode(data.id, data.assetCode)}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row justify={"start"}>
            <Col span={24}>
              <div
                className="flex w-full h-full justify-start items-start flex-col text-gray-700 px-2 "
                style={{ fontSize: "12px", fontWeight: 400 }}
              >
                <div className="flex">
                  <span
                    style={{ fontSize: "17px", color: "#000", fontWeight: 600 }}
                  >
                    {data.assetName}
                  </span>
                </div>
                <div className="flex">
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#747474",
                      fontWeight: 500,
                    }}
                  >
                    {data.assetCode}
                  </span>
                </div>
                <div
                  className="flex mb-2"
                  style={{
                    fontSize: "12px",
                    color: "#091b4b",
                    fontWeight: 600,
                  }}
                >
                  <span>{data.assetCategory}/</span>
                  <span>{data.assetProductLine}</span>
                </div>
                <div className="flex">
                  <span className="mr-1">모델명:</span>
                  <span>{data.assetModel}</span>
                </div>
                <div className="flex">
                  <span className="mr-1">제조사:</span>
                  <span>{data.assetVendor}</span>
                </div>
                <div className="flex">
                  <span className="mr-1">소유:</span>
                  <span>{data.assetOwnerCompany}</span>
                </div>
                <div className="flex">
                  <span className="mr-1">취득일자:</span>
                  <span>{data.assetPurchasedDateConverted}</span>
                </div>
                <div className="flex">
                  <span className="mr-1">위치:</span>
                  <span>{data.location}</span>
                </div>
                <div className="flex">
                  <span className="mr-1">사용자:</span>
                  <span>{data.userInfo?.userName}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={16} className="mt-5">
        <Col span={24}>
          <Collapse
            items={[{ key: 1, label: "거래정보", children: <span>매입</span> }]}
            size="small"
            style={{ alignItems: "center" }}
          />
        </Col>
      </Row>
    </>
  );
};

export default AssetView;
