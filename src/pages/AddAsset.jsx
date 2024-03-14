import React, { useContext, useEffect, useState } from "react";
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
import { useFirestoreQuery } from "../hooks/useFirestore";
import { limit, where } from "firebase/firestore";
import { orderBy } from "lodash";

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
  const [assetAccessory, setAssetAccessory] = useState([
    { name: "test", count: 1, action: null },
  ]);
  const [currentAssetAccessory, setCurrentAssetAccessory] = useState({});

  const { memberSettings, media, grouped } = useContext(CurrentLoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const location = useLocation();

  const [addStep1Form] = Form.useForm();
  const [addStep2Form] = Form.useForm();

  const assetDescriptionQuery = useFirestoreQuery();

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

  const fetchAssetDescriptionQuery = async (model, ownerId) => {
    console.log(model);
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
              addStep1Form.setFieldValue(
                "assetDescritionSummay",
                data[0].assetDescritionSummay
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

  // const handleAssetAccessoryAdd = () => {
  //   const newIndex = assetAccessory.length + 1;
  //   const newValue = {
  //     ...currentAssetAccessory,
  //     index: newIndex,
  //     action: (
  //       <Button
  //         icon={<MinusOutlined />}
  //         onClick={() =>
  //           handleAssetAccessory(assetAccessory, "remove", newIndex)
  //         }
  //       />
  //     ),
  //   };

  //   handleAssetAccessory(assetAccessory, "add", newIndex, { ...newValue });
  //   setCurrentAssetAccessory({});
  //   // assetAccessoryNameRef.current.focus({
  //   //   cursor: "all",
  //   // });
  // };
  // const handleAssetAccessory = (list, action, index, value) => {
  //   const newList = [...list];

  //   if (action === "add") {
  //     newList.push({ ...value });
  //   } else if (action === "remove") {
  //     newList.splice(index, 1);
  //   }

  //   setAssetAccessory(() => [...newList]);
  // };

  const handleInitAssetModelName = () => {
    const assetModel = addStep1Form.getFieldValue("assetModel");
    // console.log(assetModel);
    const assetVendor = addStep1Form.getFieldValue("assetVendor");
    if (assetModel !== undefined && assetVendor !== undefined) {
      setAssetName(() => assetVendor + " " + assetModel);
      addStep1Form.setFieldValue("assetName", assetVendor + " " + assetModel);
    }
    //console.log(assetName);
  };
  const onFinish = (forms = []) => {
    let unionValue = {};
    forms.map((form, fIdx) => {
      unionValue = { ...unionValue, ...form?.getFieldsValue() };
    });
    console.log(unionValue);
  };

  const initForm = () => {
    setAssetPurchasedDate(dayjs());
    setCreatedAt(dayjs());
    setAssetRentalPeriod([]);

    addStep1Form.setFieldValue("assetPurchasedType", "구매");

    addStep2Form.setFieldValue("createdAt", dayjs());
    addStep2Form.setFieldValue("assetPurchasedDate", dayjs());
    addStep2Form.setFieldValue("assetRentalPeriod", []);
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
      addStep1Form.setFieldValue("assetPurchasedType", "렌탈");
      addStep2Form.setFieldValue("assetRentalPeriod", [dayjs(), dayjs()]);
    } else {
      addStep1Form.setFieldValue("assetPurchasedType", "구매");
      setAssetPurchasedType("구매");
      setAssetRentalPeriod([]);
      addStep2Form.setFieldValue("assetRentalPeriod", []);
    }
  }, [currentCategory, currentProductLine]);

  useEffect(() => {
    console.log(assetModel);
    if (
      (memberSettings.userID && assetModel !== undefined) ||
      assetModel !== null ||
      assetModel !== ""
    ) {
      fetchAssetDescriptionQuery(assetModel, memberSettings.userID);
    }
  }, [assetModel]);

  useEffect(() => {
    initForm();
  }, []);

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
            fontSizeIcon: 14,
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
              itemMarginBottom: 0,
            },
          },
        }}
      >
        <Col span={media.isDesktopOrLaptop ? 12 : 24}>
          <Form
            labelCol={{
              span: 6,
            }}
            colon={false}
            style={{
              width: "100%",
            }}
            labelAlign="left"
            form={addStep1Form}
            layout={media.isDesktopOrLaptop ? "horizontal" : "vertical"}
          >
            <Divider orientation="left" orientationMargin="0">
              <span className="font-semibold"> 1. 분류 및 취득방식</span>
            </Divider>

            <Form.Item
              name="assetCategory"
              required
              label={<span className="font-semibold">분류선택</span>}
              className="bg-white p-2"
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
                <Form.Item name="assetVendor" noStyle>
                  <AutoComplete options={assetVendorOptions}>
                    <Input
                      style={{
                        width: media.isMobile ? "100%" : 250,
                        minWidth: 200,
                      }}
                      placeholder="제조사"
                    />
                  </AutoComplete>
                </Form.Item>
                {media.isMobile ? null : (
                  <span className="font-semibold text-gray-400">/</span>
                )}
                <Form.Item name="assetModel" noStyle>
                  <AutoComplete
                    options={assetModelOptions}
                    onChange={(value) => setAssetModel(value)}
                  >
                    <Input
                      style={{
                        width: media.isMobile ? "100%" : 250,
                        minWidth: 200,
                      }}
                      placeholder="모델명"
                    />
                  </AutoComplete>
                </Form.Item>
              </Space>
            </Form.Item>

            <Form.Item
              name="assetName"
              required
              label={<span className="font-semibold">자산명</span>}
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
              required
              label={<span className="font-semibold">보증기간</span>}
              className="bg-white p-2"
              help="＊보증기간이 만료되었거나 알수없는 경우 0으로 입력하세요."
            >
              <InputNumber
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
                  <Input placeholder="품목" />
                  <InputNumber placeholder="수량" />
                  <Button>추가</Button>
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
              required
              label={<span className="font-semibold">제품스펙</span>}
              className="bg-white p-2"
            >
              <TextArea rows={3} style={{ resize: "none" }} />
            </Form.Item>
          </Form>
        </Col>
        <Col span={media.isDesktopOrLaptop ? 12 : 24}>
          <Form
            labelCol={{
              span: 6,
            }}
            colon={false}
            style={{
              width: "100%",
            }}
            labelAlign="left"
            form={addStep2Form}
            layout={media.isDesktopOrLaptop ? "horizontal" : "vertical"}
          >
            <Divider orientation="left" orientationMargin="0">
              <span className="font-semibold"> 3. 거래 정보</span>
            </Divider>
            <Form.Item
              name="assetRentalPeriod"
              required
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
              required
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
            >
              <Input />
            </Form.Item>
            <Form.Item
              required
              label={<span className="font-semibold">취득원가/수량</span>}
              className="bg-white p-2"
            >
              <Form.Item name="assetCost" noStyle>
                <InputNumber
                  placeholder="취득원가"
                  style={{ width: 200 }}
                  addonAfter={<span>원</span>}
                />
              </Form.Item>
              <span className="font-semibold mx-2 text-gray-400">/</span>
              <Form.Item name="assetCount" noStyle>
                <InputNumber placeholder="수량" style={{ width: 80 }} />
              </Form.Item>
            </Form.Item>
            <Form.Item
              name="assetDepreciationType"
              required
              label={<span className="font-semibold">감가설정</span>}
              className="bg-white p-2"
            >
              <Space>
                <Form.Item noStyle>
                  <Segmented
                    options={[
                      { key: 1, label: "설정안함", value: "설정안함" },
                      { key: 2, label: "정액법", value: "정액법" },
                      { key: 3, label: "정률법", value: "정률법" },
                    ]}
                  />
                </Form.Item>
                <Form.Item noStyle>
                  <Select style={{ width: 150 }} />
                </Form.Item>
              </Space>
            </Form.Item>
            <Divider orientation="left" orientationMargin="0">
              <span className="font-semibold"> 4. 사진/일련번호</span>
            </Divider>
            <Button
              type="default"
              className="bg-blue-500"
              onClick={() => onFinish([addStep1Form, addStep2Form])}
            >
              저장
            </Button>
          </Form>
        </Col>
      </ConfigProvider>
    </PageContainer>
  );
};

export default AddAsset;
