import React, { useContext, useEffect, useRef, useState } from "react";
import { CurrentLoginContext } from "../context/CurrentLogin";
import { useLocation } from "react-router";
import PageContainer from "../layout/PageContainer";
import { navigateMenus } from "../navigate";
import {
  Card,
  Col,
  ConfigProvider,
  Form,
  Segmented,
  Select,
  Space,
  Divider,
  AutoComplete,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Upload,
  Table,
  Row,
  message,
  notification,
} from "antd";

import {
  PlusOutlined,
  LoadingOutlined,
  UploadOutlined,
  MinusOutlined,
  DownOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import { useFirestoreAddData, useFirestoreQuery } from "../hooks/useFirestore";
import { Timestamp, limit, where } from "firebase/firestore";
import { orderBy } from "lodash";
import {
  ConvertDateToTimestampAndConverted,
  ConvertDateToTimestampByObject,
  ConvertTimestampToDateByArray,
} from "../utils/Index";
import { initDepreciationPeriod, initDepreciationRate } from "../InitValues";
import { UploadImageWithCompress } from "../share/Index";
import {
  NumberWithComma,
  convertTimestampToDate,
  generateFileName,
  generateUUID,
  removeCommas,
} from "../functions";
import useImageUpload from "../hooks/useFireStorage";

const AddAsset = () => {
  const [assetDepreciationPeriod, setAssetDepreciationPeriod] = useState(0);
  const [assetDepreciationType, setAssetDepreciationType] =
    useState("설정안함");

  const [assetPurchasedType, setAssetPurchasedType] = useState("구매");
  const [assetRentalPeriod, setAssetRentalPeriod] = useState([]);
  const [assetPurchasedDate, setAssetPurchasedDate] = useState();
  const [createdAt, setCreatedAt] = useState();
  const [assetCategoriesList, setAssetCategoriesList] = useState([]);
  const [assetCategoryOptions, setAssetCategoryOptions] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentProductLine, setCurrentProductLine] = useState("");
  const [productLineList, setProductLineList] = useState([]);
  const [assetVendorOptions, setAssetVendorOptions] = useState([]);
  const [assetModelOptions, setAssetModelOptions] = useState([]);
  const [assetPurchaseOptions, setAssetPurchaseOptions] = useState([]);
  const [assetModel, setAssetModel] = useState("");
  const [assetName, setAssetName] = useState("");
  const [assetCount, setAssetCount] = useState(0);
  const [assetCost, setAssetCost] = useState("");
  const [assetList, setAssetList] = useState([]);
  const [uploadTargetFileList, setUploadTargetFileList] = useState([]);
  const [assetAccessory, setAssetAccessory] = useState([]);
  const [currentAssetAccessory, setCurrentAssetAccessory] = useState({});

  const { memberSettings, media, grouped, setGrouped } =
    useContext(CurrentLoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const location = useLocation();

  const [addForm] = Form.useForm();

  const assetAdd = useFirestoreAddData();
  const assetFeedAdd = useFirestoreAddData();
  const assetDescriptionQuery = useFirestoreQuery();
  const assetImageUpload = useImageUpload();
  const inputRefs = useRef([]);

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

  // const beforeUpload = (file, filelist, index, onSuccess) => {
  //   console.log({ index: index, files: file, filelist });
  //   onSuccess();
  // };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("사진 파일만 업로드해주세요!");
    }
    return isJpgOrPng || Upload.LIST_IGNORE; // 파일이 jpg 또는 png가 아니면 업로드 목록에서 제외
  };

  const handleAssetListUpdate = (index, key, value, list, setList) => {
    const newValue = { ...list[index], [key]: value };
    const newList = [...list];
    newList.splice(index, 1, newValue);
    setList(newList);
  };

  const handleUploadTarget = (index, filelist, list, setList) => {
    const newFilelist = [...filelist];
    let newList = [...list];
    const newValue = { ...list[index], fileList: newFilelist };
    newList.splice(index, 1, newValue);
    setList(newList);
  };

  const handleFocus = (index) => {
    // Input에 포커스가 되면 전체 텍스트를 선택합니다.
    const input = inputRefs.current[index];
    if (input) {
      input.select();
    }
  };

  const randomAssetCode = (length = 0) => {
    if (length > 0) {
      const codes = Array.from({ length }, (_, index) => {
        const newAssetCode = {
          index,
          assetCode: generateUUID().toUpperCase(),
          assetMemo: "",
        };
        return newAssetCode;
      });

      setAssetList(() => [...codes]);
    } else if (length <= 0) {
      setAssetList([]);
    }
  };

  const resetAssetCode = (length = 0) => {
    if (length > 0) {
      const codes = Array.from({ length }, (_, index) => {
        const newAssetCode = {
          index,
          assetCode: "",
          assetMemo: "",
        };
        return newAssetCode;
      });

      setAssetList(() => [...codes]);
    }
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {isUploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div>사진올리기</div>
    </button>
  );

  const assetListRender = (index) => {
    //console.log(uploadTargetFileList[index]);
    return (
      <div
        className={`flex w-full border-b box-border py-2 ${
          media.isMobile ? " flex-col " : " flex-row "
        }`}
        style={{ minHeight: "120px" }}
      >
        <div
          className="flex justify-center items-center "
          style={{ minHeight: "120px", width: 40 }}
        >
          {index + 1}
        </div>
        <div
          className="flex justify-center items-center"
          style={{ minHeight: "120px" }}
        >
          <Upload
            listType="picture-card"
            onChange={(file) => {
              console.log(file.file);
              handleUploadTarget(
                index,
                file.fileList,
                uploadTargetFileList,
                setUploadTargetFileList
              );
            }}
            beforeUpload={beforeUpload}
            className=" align-middle"
            style={{ height: "120px" }}
            maxCount={1}
          >
            {uploadTargetFileList[index]?.fileList?.length === 0 &&
              uploadButton}
          </Upload>
        </div>
        <div
          className="flex w-full flex-col gap-y-2"
          style={{ minHeight: "120px" }}
        >
          <div className="flex w-full">
            <Input
              placeholder="일련번호"
              value={assetList[index]?.assetCode}
              ref={(el) => (inputRefs.current[index] = el)}
              onFocus={() => handleFocus(index)}
              onChange={(e) => {
                handleAssetListUpdate(
                  index,
                  "assetCode",
                  e.target.value,
                  assetList,
                  setAssetList
                );
              }}
            />
          </div>
          <div className="flex w-full">
            <TextArea
              rows={3}
              style={{ resize: "none" }}
              placeholder="비고"
              value={assetList[index]?.assetMemo}
              onChange={(e) => {
                handleAssetListUpdate(
                  index,
                  "assetMemo",
                  e.target.value,
                  assetList,
                  setAssetList
                );
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  const fetchAssetDescriptionQuery = async (model, ownerId) => {
    //console.log(model);
    const condition = [
      where("assetModel", "==", model),
      where("assetOwner", "==", ownerId),
      orderBy("createdAt", "desc"),
      limit(1),
    ];

    try {
      await assetDescriptionQuery
        .getDocuments(
          "assets",
          (data) => {
            console.log(data);
            if (data.length > 0 && data[0]?.assetDescritionSummay) {
              addForm.setFieldValue(
                "assetDescritionSummay",
                data[0]?.assetDescritionSummay
              );
            }
          },
          condition
        )
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAssetAccessoryAdd = () => {
    const newIndex = assetAccessory.length + 1;
    const newValue = {
      index: newIndex,
      ...currentAssetAccessory,
    };

    handleAssetAccessory(assetAccessory, "add", newIndex, { ...newValue });
    setCurrentAssetAccessory({ name: "", count: "" });
    // assetAccessoryNameRef.current.focus({
    //   cursor: "all",
    // });
  };
  const handleAssetAccessory = (list, action, index, value) => {
    const newList = [...list];

    if (action === "add") {
      newList.push({ ...value, status: "정상" });
    } else if (action === "remove") {
      newList.splice(index, 1);
    }

    setAssetAccessory(() => [...newList]);
  };

  const handleInitAssetAccessory = (name, list, setList) => {
    const initValue = { index: 1, name, count: 1 };
    const newList = [...list];
    newList.splice(0, 1, { ...initValue });
    setList(newList);
  };

  const handleInitAssetModelName = () => {
    const assetModel = addForm.getFieldValue("assetModel");

    const assetVendor = addForm.getFieldValue("assetVendor");
    if (assetModel !== undefined && assetVendor !== undefined) {
      setAssetName(() => assetVendor + " " + assetModel);
      addForm.setFieldValue("assetName", assetVendor + " " + assetModel);
    }
  };

  const handleImageUpload = async ({ file, index }) => {
    const newFileName = generateFileName(file.name, generateUUID());
    const storageUrl = `/assetPics/${memberSettings.userID}`;
    let result = {};
    try {
      const upload = await assetImageUpload.uploadImage(
        storageUrl,
        file,
        newFileName
      );
      if (upload.success) {
        result = {
          index,
          storageUrl,
          name: newFileName,
          url: upload.downloadUrl,
          status: "uploaded",
        };
      }
    } catch (error) {
      result = { index, status: error };
    }

    return result;
  };

  const handleImageUploadAndStateUpdate = async (list) => {
    let files = [];
    for (const { fileList, index } of list) {
      const targetFile = fileList[0]?.originFileObj;
      if (targetFile) {
        // 파일이 존재할 경우에만 배열에 추가
        files.push({ targetFile, targetIndex: index });
      }
    }

    let results = [];
    for (const item of files) {
      const uploadResult = await handleImageUpload({
        file: item.targetFile,
        index: item.targetIndex,
      });
      results.push(uploadResult);
    }

    const newAssetList = [...assetList];
    results.forEach((uploaded, idx) => {
      if (uploaded) {
        // 업로드 결과가 존재할 경우에만 처리
        const newValue = { ...newAssetList[idx], firstPics: [uploaded] };
        newAssetList.splice(idx, 1, newValue);
      }
    });

    return newAssetList;
  };

  const onFinish = async (values) => {
    const updateGrouped = (condition, key, value) => {
      // if (condition?.length === 0) {
      //   setGrouped((prevGrouped) => ({
      //     ...prevGrouped,
      //     [key]: [...prevGrouped[key], { value, label: value }],
      //   }));
      // }
      setGrouped((prevGrouped) => ({
        ...prevGrouped,
        [key]: [...prevGrouped[key], { value, label: value }],
      }));
    };

    // 사용 예:
    updateGrouped(assetModelOptions, "groupedModel", values.assetModel);
    updateGrouped(assetVendorOptions, "groupedVendor", values.assetVendor);
    updateGrouped(
      assetPurchaseOptions,
      "groupedPurchaseName",
      values.assetPurchaseName
    );

    const newValue = Object.keys(values).reduce((acc, key) => {
      acc[key] = values[key] === undefined ? "" : values[key];
      return acc;
    }, {});

    const assetPurchasedDate = values.assetPurchasedDate
      ? Timestamp.fromDate(values.assetPurchasedDate.toDate())
      : Timestamp.fromDate(new Date());

    const assetPurchasedDateConverted =
      convertTimestampToDate(assetPurchasedDate);

    const createdAt = values.createdAt
      ? Timestamp.fromDate(values.createdAt.toDate())
      : Timestamp.fromDate(new Date());

    const createdAtConverted = convertTimestampToDate(createdAt);

    let assetRentalPeriod = [];
    let assetRentalPeriodConverted = [];

    if (assetPurchasedType === "렌탈") {
      assetRentalPeriod = [
        Timestamp.fromDate(new Date()),
        Timestamp.fromDate(new Date()),
      ];
      assetRentalPeriodConverted = [
        convertTimestampToDate(assetRentalPeriod[0]),
        convertTimestampToDate(assetRentalPeriod[1]),
      ];
      if (values.assetRentalPeriod?.length > 0) {
        const newPeriod = values.assetRentalPeriod.map((rent, rIdx) => {
          return Timestamp.fromDate(rent.toDate());
        });
        const newPeriodConverted = values.assetRentalPeriod.map(
          (rent, rIdx) => {
            return convertTimestampToDate(Timestamp.fromDate(rent.toDate()));
          }
        );
        assetRentalPeriod = newPeriod;
        assetRentalPeriodConverted = newPeriodConverted;
      }
    }

    const newAccessory = assetAccessory.map((accessory, aIdx) => {
      const newAcc = { ...accessory };
      delete newAcc.action;
      return newAcc;
    });

    // userEnteringDate와 createdAt 필드 추가
    newValue.assetPurchasedType = assetPurchasedType;
    newValue.assetPurchasedDate = assetPurchasedDate;
    newValue.assetPurchasedDateConverted = assetPurchasedDateConverted;
    newValue.assetCost = removeCommas(values.assetCost);
    newValue.assetAccessory = [...newAccessory];
    newValue.assetRentalPeriod = assetRentalPeriod;
    newValue.assetRentalPeriodConverted = assetRentalPeriodConverted;
    newValue.createdAt = createdAt;
    newValue.createdAtConverted = createdAtConverted;
    newValue.location = "출고대기";
    newValue.userInfo = { userName: "미지정" };
    newValue.currentUser = "미지정";
    newValue.assetPics = [];

    delete newValue.assetCount;

    const assets = await handleImageUploadAndStateUpdate(uploadTargetFileList);

    if (assets.length > 0) {
      assets.map(async (asset, cIdx) => {
        const codeWithValue = {
          ...newValue,
          assetUID: generateUUID(),
          assetCode: asset?.assetCode.toUpperCase() || "",
          assetMemo: asset.assetMemo,
          firstPics:
            asset?.firstPics === undefined ? [] : [...asset?.firstPics],
          assetOwner: memberSettings.userID,
        };
        console.log(codeWithValue);

        try {
          await assetAdd.addData(
            "assets",
            { ...codeWithValue },

            async (data) => {
              //피드를 이렇게 넣는 방법에 대해 다시 고민해보자. 24-03-21
              // await assetFeedAdd.addData("assetFeeds", {
              //   refAssetID: data.id,
              //   refAssetCode: codeWithValue.assetCode,
              //   createdBy: "system",
              //   createdAt,
              //   createdAtConverted,
              //   actionAt: assetPurchasedDate,
              //   actionAtConverted: convertTimestampToDate(assetPurchasedDate),
              //   feedType: "추가",
              //   feedContext: `자산에 추가 되었습니다.`,
              //   feedPics:
              //     asset?.firstPics === undefined ? [] : [...asset?.firstPics],
              // });
              openNotification(
                "success",
                "추가완료",
                `자산을 추가했습니다.`,
                "topRight",
                3
              );
              initForm();
            }
          );
        } catch (error) {
          console.log(error);
        }
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const initForm = () => {
    setAssetPurchasedDate(dayjs());
    setCreatedAt(dayjs());
    setAssetRentalPeriod([]);
    setAssetAccessory([]);
    setAssetList([]);
    setUploadTargetFileList([]);
    setAssetCount(0);
    addForm.resetFields();

    addForm.setFieldValue("assetPurchasedType", "구매");
    addForm.setFieldValue("assetDescritionSummay", "");
    addForm.setFieldValue("createdAt", dayjs());
    addForm.setFieldValue("assetPurchasedDate", dayjs());
    addForm.setFieldValue("assetRentalPeriod", []);
    addForm.setFieldValue("assetDepreciationType", "설정안함");
    addForm.setFieldValue("assetDepreciationPeriod", 0);
  };

  const handleAssetOptions = (childrenArray) => {
    const childs = childrenArray.map((child, cIdx) => {
      const childValue = {
        key: cIdx + 1,
        label: child.name,
        value: child.name,
      };
      return childValue;
    });

    return childs;
  };

  const filterProductLine = (categoryName, list) => {
    if (list?.assetCategories) {
      const filtered = list.assetCategories.find(
        (f) => f.name === categoryName
      );

      if (filtered?.productLine?.length > 0) {
        setProductLineList(() => [...filtered.productLine]);
      } else {
        setProductLineList([]);
      }
    }
  };

  useEffect(() => {
    if (memberSettings?.assetCategories) {
      setAssetCategoriesList(() => [...memberSettings.assetCategories]);

      setAssetCategoryOptions(() =>
        handleAssetOptions([...memberSettings.assetCategories])
      );
    }
  }, [memberSettings]);

  useEffect(() => {
    if (location.pathname) {
      setIsLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (grouped) {
      setAssetModelOptions(() => [...grouped.groupedModel]);
      setAssetVendorOptions(() => [...grouped.groupedVendor]);
      setAssetPurchaseOptions(() => [...grouped.groupedPurchaseName]);
    }
  }, [grouped]);

  useEffect(() => {
    if (currentCategory === "소프트웨어" && currentProductLine === "구독형") {
      setAssetPurchasedType("렌탈");
      setAssetRentalPeriod([dayjs(), dayjs()]);
      addForm.setFieldValue("assetPurchasedType", "렌탈");
      addForm.setFieldValue("assetRentalPeriod", [dayjs(), dayjs()]);
    } else {
      addForm.setFieldValue("assetPurchasedType", "구매");
      setAssetPurchasedType("구매");
      setAssetRentalPeriod([]);
      addForm.setFieldValue("assetRentalPeriod", []);
    }

    if (currentCategory && currentProductLine) {
      const findCategory = memberSettings?.assetCategories.find(
        (f) => f.name === currentCategory
      );

      const findProductLine = findCategory.productLine.find(
        (f) => f.name === currentProductLine
      );

      if (
        findProductLine?.length > 0 &&
        findProductLine.assetDepreciationType
      ) {
        setAssetDepreciationType(findProductLine.depreciationType);
        setAssetDepreciationPeriod(findProductLine.depreciationPeriod);
        addForm.setFieldValue(
          "assetDepreciationType",
          findProductLine.depreciationType
        );
        addForm.setFieldValue(
          "assetDepreciationPeriod",
          findProductLine.depreciationPeriod
        );
      } else {
        setAssetDepreciationType(findCategory.depreciationType || "설정안함");
        setAssetDepreciationPeriod(findCategory.depreciationPeriod || 0);
        addForm.setFieldValue(
          "assetDepreciationType",
          findCategory.depreciationType
        );
        addForm.setFieldValue(
          "assetDepreciationPeriod",
          findCategory.depreciationPeriod
        );
      }
    }
  }, [currentCategory, currentProductLine]);

  useEffect(() => {
    if (
      (memberSettings.userID && assetModel !== undefined) ||
      assetModel !== null ||
      assetModel !== ""
    ) {
      fetchAssetDescriptionQuery(assetModel, memberSettings.userID);
    }
  }, [assetModel]);

  useEffect(() => {
    if (assetName !== "") {
      handleInitAssetAccessory(assetName, assetAccessory, setAssetAccessory);
    }
  }, [assetName]);

  useEffect(() => {
    const initUploadTarget = Array.from({ length: assetCount }, (_, index) => {
      const newValue = { index, fileList: [] };
      return newValue;
    });
    inputRefs.current = inputRefs.current.slice(0, assetCount);

    randomAssetCode(assetCount);
    setUploadTargetFileList(initUploadTarget);
  }, [assetCount]);

  useEffect(() => {
    initForm();
  }, []);

  useEffect(() => {
    console.log(uploadTargetFileList);
  }, [uploadTargetFileList]);

  return (
    <PageContainer
      isLoading={isLoading}
      pathname={location?.pathname}
      title={navigateMenus.find((f) => f.link === location.pathname).label}
      gutter={[16, 16]}
    >
      <ConfigProvider
        theme={{
          // token: { colorPrimary: "#93ffb7", colorPrimaryHover: "#c0ffd4" },
          token: {
            fontSize: 13,
            colorPrimary: "#f5f5f5",
            colorPrimaryHover: "#f5f5f5",
            colorBorder: "#f5f5f5",
            //fontSizeIcon: 0,
            colorBgContainer: "#f5f5f5",
          },
          components: {
            Select: {
              selectorBg: "#f5f5f5",
            },
            Input: {
              activeBg: "#f5f5f5",
              hoverBg: "#f5f5f5",
              addonBg: "#f5f5f5",
              activeShadow: "#f5f5f5",
            },
            Form: {
              labelFontSize: 13,
              labelColor: "#888888",
              itemMarginBottom: 5,
            },
            Button: {
              colorBorder: "#d9d9d9",
              colorPrimary: "#000",
              colorPrimaryHover: "#d9d9d",
            },
            Divider: {
              colorSplit: "#d8d8d8",
            },
          },
        }}
      >
        <Form
          className="w-full"
          labelCol={{
            span: 6,
          }}
          colon={false}
          style={{
            width: "100%",
          }}
          labelAlign="left"
          form={addForm}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout={media.isDesktopOrLaptop ? "horizontal" : "vertical"}
        >
          <Row
            gutter={media.isDesktopOrLaptop ? [24, 24] : [0, 0]}
            className="w-full"
          >
            <Col span={media.isDesktopOrLaptop ? 12 : 24}>
              <Divider orientation="left" orientationMargin="0">
                <span className="font-semibold"> 1. 분류 및 취득방식</span>
              </Divider>

              <Form.Item
                name="assetCategory"
                label={<span className="font-semibold">분류선택</span>}
                className="bg-white p-2"
                rules={[{ required: true, message: "분류를 선택해주세요." }]}
              >
                <Select
                  allowClear
                  placeholder="분류"
                  className="w-full"
                  options={assetCategoriesList.map((category, cIdx) => ({
                    label: category.name,
                    value: category.name,
                  }))}
                  onChange={(value) => {
                    setCurrentCategory(value);
                    filterProductLine(value, memberSettings);
                  }}
                />
              </Form.Item>

              <Form.Item
                name="assetProductLine"
                required
                label={<span className="font-semibold">품목선택</span>}
                className="bg-white p-2"
                rules={[{ required: true, message: "품목을 선택해주세요." }]}
              >
                <Select
                  allowClear
                  placeholder="품목"
                  className="w-full"
                  options={productLineList.map((product, pIdx) => ({
                    label: product.name,
                    value: product.name,
                  }))}
                  onChange={(value) => setCurrentProductLine(value)}
                />
              </Form.Item>
              <Form.Item
                name="assetPurchasedType"
                required
                rules={[
                  {
                    required: true,
                    message: "취득방식을 다시한번 확인해주세요.",
                  },
                ]}
                className={
                  currentCategory === "소프트웨어" &&
                  currentProductLine === "구독형"
                    ? "hidden"
                    : "bg-white p-2"
                }
                label={<span className="font-semibold">취득방식</span>}
              >
                <Segmented
                  options={
                    currentCategory === "소프트웨어" &&
                    currentProductLine === "구독형"
                      ? [{ label: "렌탈/구독", value: "렌탈" }]
                      : [
                          { label: "구매", value: "구매" },
                          { label: "렌탈/구독", value: "렌탈" },
                          { label: "무상", value: "무상" },
                        ]
                  }
                  onChange={(value) => setAssetPurchasedType(value)}
                />
              </Form.Item>
              <Divider orientation="left" orientationMargin="0">
                <span className="font-semibold">2. 제품 정보</span>
              </Divider>

              <Form.Item
                required
                label={<span className="font-semibold">제조사/모델명</span>}
                className="bg-white p-2"
              >
                <Space
                  className="w-full"
                  direction={media.isMobile ? "vertical" : "horizontal"}
                >
                  <Form.Item
                    name="assetVendor"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message:
                          "제조사를 특정하기 어렵다면 구매처를 입력해주세요.",
                      },
                    ]}
                  >
                    <AutoComplete options={assetVendorOptions}>
                      <Input
                        style={{
                          width: media.isMobile ? "100%" : 220,
                        }}
                        placeholder="제조사"
                      />
                    </AutoComplete>
                  </Form.Item>
                  {media.isMobile ? null : (
                    <span className="font-semibold text-gray-400">/</span>
                  )}
                  <Form.Item
                    name="assetModel"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message:
                          "모델명을 특정하기 어렵다면 품목을 입력해주세요.",
                      },
                    ]}
                  >
                    <AutoComplete
                      options={assetModelOptions}
                      onChange={(value) => setAssetModel(value)}
                    >
                      <Input
                        style={{
                          width: media.isMobile ? "100%" : 220,
                        }}
                        placeholder="모델명"
                      />
                    </AutoComplete>
                  </Form.Item>
                </Space>
              </Form.Item>

              <Form.Item
                name="assetName"
                label={<span className="font-semibold">자산명</span>}
                rules={[
                  {
                    required: true,
                    message:
                      "자산명은 제조사와 모델명을 입력하신후에 자산명 필드에 클릭하세요.",
                  },
                ]}
                className="bg-white p-2"
              >
                <Input
                  value={assetName}
                  onFocus={handleInitAssetModelName}
                  onChange={(e) => setAssetName(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="assetWarranty"
                label={<span className="font-semibold">보증기간</span>}
                className="bg-white p-2"
                help="＊보증기간이 만료되었거나 알수없는 경우 0으로 입력하세요."
              >
                <InputNumber
                  defaultValue={0}
                  style={{ width: 110 }}
                  addonAfter={<span>개월</span>}
                />
              </Form.Item>
              {assetAccessory.length > 0 && (
                <Form.Item
                  required
                  label={<span className="font-semibold">구성품</span>}
                  className="bg-white p-2 border-d"
                >
                  <Space className="w-full mb-2">
                    <Input
                      placeholder="품목"
                      value={currentAssetAccessory.name}
                      onChange={(e) =>
                        setCurrentAssetAccessory({
                          ...currentAssetAccessory,
                          name: e.target.value,
                        })
                      }
                    />
                    <InputNumber
                      placeholder="수량"
                      value={currentAssetAccessory.count}
                      onChange={(value) =>
                        setCurrentAssetAccessory({
                          ...currentAssetAccessory,
                          count: value,
                        })
                      }
                    />
                    <Button
                      disabled={
                        currentAssetAccessory.name === "" ||
                        currentAssetAccessory.count === "" ||
                        currentAssetAccessory.name === undefined ||
                        currentAssetAccessory.count === undefined
                      }
                      onClick={() => {
                        handleAssetAccessoryAdd();
                      }}
                    >
                      추가
                    </Button>
                  </Space>
                  <Table
                    size="small"
                    columns={[
                      {
                        title: <span className="font-normal">품목</span>,
                        width: 500,
                        dataIndex: "name",
                      },
                      {
                        title: <span className="font-normal">수량</span>,

                        width: 200,
                        dataIndex: "count",
                      },
                    ]}
                    dataSource={assetAccessory}
                    pagination={false}
                    style={{
                      width: "100%",
                      backgroundColor: "#f5f5f5",
                      borderRadius: 5,
                    }}
                  />
                </Form.Item>
              )}

              <Form.Item
                name="assetDescritionSummay"
                label={<span className="font-semibold">제품스펙</span>}
                className="bg-white p-2"
              >
                <TextArea rows={3} style={{ resize: "none" }} />
              </Form.Item>
            </Col>
            <Col span={media.isDesktopOrLaptop ? 12 : 24}>
              <Divider orientation="left" orientationMargin="0">
                <span className="font-semibold"> 3. 거래 정보</span>
              </Divider>
              <Form.Item
                name="assetRentalPeriod"
                label={<span className="font-semibold">계약기간</span>}
                className={
                  assetPurchasedType === "렌탈" ? "bg-white p-2" : "hidden"
                }
              >
                <DatePicker.RangePicker
                  locale={locale}
                  value={assetRentalPeriod}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
              <Form.Item
                name="assetPurchasedDate"
                label={<span className="font-semibold">거래일자/등록일자</span>}
                className="bg-white p-2"
              >
                <Form.Item name="assetPurchasedDate" noStyle>
                  <DatePicker locale={locale} />
                </Form.Item>
                <span className="font-semibold mx-2 text-gray-400">/</span>
                <Form.Item name="createdAt" noStyle>
                  <DatePicker locale={locale} />
                </Form.Item>
              </Form.Item>
              <Form.Item
                name="assetPurchaseName"
                required
                label={<span className="font-semibold">구매처</span>}
                rules={[
                  {
                    required: true,
                    message: "구매처를 입력해주세요.",
                  },
                ]}
                className="bg-white p-2"
              >
                <AutoComplete options={assetPurchaseOptions}>
                  <Input />
                </AutoComplete>
              </Form.Item>
              <Form.Item
                name="assetOwnerCompany"
                required
                label={<span className="font-semibold">자산소유</span>}
                className="bg-white p-2"
                rules={[
                  {
                    required: true,
                    message: "자회사 보유시 소유사를 선택해주세요.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                required
                label={<span className="font-semibold">취득원가/수량</span>}
                className="bg-white p-2"
              >
                <Form.Item
                  name="assetCost"
                  rules={[
                    {
                      required: true,
                      message: "무상이라면 0을 입력해주세요.",
                    },
                  ]}
                  noStyle
                >
                  <Input
                    placeholder="취득원가"
                    style={{ textAlign: "right", marginRight: 1, width: 200 }}
                    onChange={(e) => {
                      addForm.setFieldValue(
                        "assetCost",
                        NumberWithComma(e.target.value)
                      );
                    }}
                    addonAfter={<span>원</span>}
                  />
                </Form.Item>
                <span className="font-semibold mx-2 text-gray-400">/</span>
                <Form.Item name="assetCount" noStyle>
                  <InputNumber
                    placeholder="수량"
                    value={assetCount}
                    onChange={(value) => setAssetCount(value)}
                    style={{ width: 80 }}
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item
                label={<span className="font-semibold">감가설정</span>}
                className="bg-white p-2"
              >
                <Space>
                  <Form.Item name="assetDepreciationType" noStyle>
                    <Segmented
                      options={["설정안함", "정액법", "정률법"]}
                      onChange={(value) => {
                        setAssetDepreciationType(value);
                        addForm.setFieldValue("assetDepreciationPeriod", "");
                      }}
                    />
                  </Form.Item>
                  <Form.Item name="assetDepreciationPeriod" noStyle>
                    <Select
                      style={{ width: 150 }}
                      options={
                        assetDepreciationType === "정액법"
                          ? [...initDepreciationPeriod]
                          : [...initDepreciationRate]
                      }
                      className={
                        assetDepreciationType === "설정안함" && "hidden"
                      }
                    />
                  </Form.Item>
                </Space>
              </Form.Item>
              <Divider orientation="left" orientationMargin="0">
                <div className="flex w-full justify-between items-center ">
                  <span className="font-semibold"> 4. 사진/일련번호</span>
                  <div className="flex ml-8" style={{ fontSize: 12 }}>
                    <button
                      type="button"
                      className="border rounded p-1"
                      onClick={() => randomAssetCode(assetCount)}
                    >
                      일련번호생성
                    </button>
                  </div>
                  <div className="flex ml-2" style={{ fontSize: 12 }}>
                    <button
                      type="button"
                      className="border rounded p-1"
                      onClick={() => resetAssetCode(assetCount)}
                    >
                      일련번호초기화
                    </button>
                  </div>
                </div>
              </Divider>
              <Form.Item noStyle>
                {assetCount > 0 &&
                  Array.from({ length: assetCount }, (_, index) => {
                    return assetListRender(index);
                  })}
              </Form.Item>
              <Form.Item noStyle>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-500"
                >
                  저장
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {contextHolder}
      </ConfigProvider>
    </PageContainer>
  );
};

export default AddAsset;
