import React, { useContext, useEffect, useRef, useState } from "react";
import { ContentTitle } from "../commonstyles/Title";
import {
  AutoComplete,
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
  Table,
  Upload,
  notification,
} from "antd";
import { PlusOutlined, UploadOutlined, MinusOutlined } from "@ant-design/icons";
import { FaMinus, FaPlus } from "react-icons/fa";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import {
  NumberWithComma,
  generateFileName,
  generateUUID,
  removeCommas,
} from "../functions";
import { Timestamp } from "firebase/firestore";
import { useFirestoreAddData } from "../hooks/useFirestore";
import { CurrentLoginContext } from "../context/CurrentLogin";
import useImageUpload from "../hooks/useFireStorage";
import {
  initDepreciationPeriod,
  initDepreciationRate,
  initDepreciationType,
} from "../InitValues";
import { useEnterKeyToNextField } from "../hooks/useEnterKey";
import AssetDescription from "../components/AssetDescription";
import TextArea from "antd/es/input/TextArea";

const NewAsset = () => {
  const formRef = useRef();
  const assetAdd = useFirestoreAddData();
  const [assetInputs, setAssetInputs] = useState([]);
  const [assetCodes, setAssetCodes] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [assetDepreciationType, setAssetDepreciationType] =
    useState("설정안함");
  const [assetDepreciationPeriod, setAssetDepreciationPeriod] = useState(0);
  const [assetCategoriesList, setAssetCategoriesList] = useState([]);
  const [assetCategoryOptions, setAssetCategoryOptions] = useState([]);
  const [currentProductLine, setCurrentProductLine] = useState("");
  const [productLineList, setProductLineList] = useState([]);
  const [productLineOptions, setProductLineOptions] = useState([]);
  const [productLineDescription, setProductLineDescription] = useState({});
  const [isDetailDescription, setIsDetailDescription] = useState(false);
  const [assetCount, setAssetCount] = useState(0);

  const [assetVendor, setAssetVendor] = useState("");
  const [assetModel, setAssetModel] = useState("");

  const [assetAccessory, setAssetAccessory] = useState([]);
  const [currentAssetAccessory, setCurrentAssetAccessory] = useState({});
  const [categoryInput, setCategoryInput] = useState("");
  const [productLineInput, setProductLineInput] = useState("");
  const addCategoryRef = useRef();
  const addProductLineRef = useRef();
  const assetPicUpload = useImageUpload();

  const { loginInfo, memberSettings } = useContext(CurrentLoginContext);
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

  const [form] = Form.useForm();
  const assetVendorRef = useRef();
  const assetModelRef = useRef();
  const assetNameRef = useRef();
  const assetDescritionSummayRef = useRef();
  const assetWarrantyRef = useRef();
  const assetPurchaseNameRef = useRef();
  const assetOwnerCompanyRef = useRef();
  const assetDepreciationTypeRef = useRef();
  const assetDepreciationPeroidRef = useRef();
  const assetCountRef = useRef();
  const assetCostRef = useRef();
  const assetPurchasedDateRef = useRef();
  const createAtRef = useRef();
  const assetAccessoryNameRef = useRef();
  const assetAccessoryCountRef = useRef();
  const assetAccessorAddRef = useRef();
  //useEnterKeyToNextField();

  const renderInput = (code, index) => {
    return (
      <div className="flex w-full justify-start items-start flex-col ">
        <div className="flex mb-2 w-full flex-wrap">
          <Upload
            listType="picture"
            fileList={assetCodes[index].firstPics}
            customRequest={({ file, onSuccess, onError }) =>
              handleAssetPicUploadAdd({
                file,
                onSuccess,
                onError,
                index,
              })
            }
          >
            <Button icon={<UploadOutlined />}>사진업로드</Button>
          </Upload>
        </div>
        <div className="flex w-full">
          <Input
            key={code.assetCode.toUpperCase()} // 고유한 key 추가
            defaultValue={code.assetCode.toUpperCase()}
            style={{ width: "100%" }}
            onChange={(e) => {
              const newAssetCodes = [...assetCodes];

              const newCode = e.target.value;
              newAssetCodes.splice(index, 1, {
                ...newAssetCodes[index],
                assetCode: newCode,
              });

              setAssetCodes(() => [...newAssetCodes]);
            }}
          />
        </div>
      </div>
    );
  };
  const handleAssetAccessoryAdd = () => {
    const newIndex = assetAccessory.length + 1;
    const newValue = {
      ...currentAssetAccessory,
      index: newIndex,
      action: (
        <Button
          icon={<MinusOutlined />}
          onClick={() =>
            handleAssetAccessory(assetAccessory, "remove", newIndex)
          }
        />
      ),
    };
    handleAssetAccessory(assetAccessory, "add", newIndex, { ...newValue });
    setCurrentAssetAccessory({});
    assetAccessoryNameRef.current.focus({
      cursor: "all",
    });
  };
  const handleAssetAccessory = (list, action, index, value) => {
    const newList = [...list];

    if (action === "add") {
      newList.push({ ...value });
    } else if (action === "remove") {
      newList.splice(index, 1);
    }

    setAssetAccessory(() => [...newList]);
  };

  const handleFinish = (values) => {
    // userEnteringDate를 Date 객체로 변환한 후 Firestore Timestamp로 변환

    const assetPurchasedDate = values.assetPurchasedDate
      ? Timestamp.fromDate(values.assetPurchasedDate.toDate())
      : "";

    const createdAtValue = values.createdAt
      ? Timestamp.fromDate(values.createdAt.toDate())
      : Timestamp.fromDate(new Date());

    // value 객체의 각 필드를 확인하고 undefined인 경우 빈 문자열로 대체
    const newValue = Object.keys(values).reduce((acc, key) => {
      acc[key] = values[key] === undefined ? "" : values[key];
      return acc;
    }, {});

    const newAccessory = assetAccessory.map((accessory, aIdx) => {
      const newAcc = { ...accessory };
      delete newAcc.action;
      return newAcc;
    });

    // userEnteringDate와 createdAt 필드 추가
    newValue.assetPurchasedDate = assetPurchasedDate;
    newValue.assetCost = removeCommas(values.assetCost);
    newValue.assetAccessory = [...newAccessory];
    newValue.createdAt = createdAtValue;
    newValue.location = "출고대기";
    newValue.userInfo = "미배정";
    //newValue.assetWarranty = assetWarranty;
    delete newValue.assetCount;

    if (assetCodes.length > 0) {
      assetCodes.map(async (asset, cIdx) => {
        const codeWithValue = {
          assetCode: asset.assetCode.toUpperCase(),
          firstPics: [...asset.firstPics],
          assetOwner: memberSettings.userID,
          ...newValue,
        };
        console.log(codeWithValue);

        try {
          await assetAdd.addData("assets", { ...codeWithValue }, (data) => {
            openNotification(
              "success",
              "추가 성공",
              `${data?.assetName}을 추가했습니다.`,
              "topRight",
              3,
              5
            );
          });
        } catch (error) {
          console.log(error);
        }
      });
    }
    initFormValue(formRef);
  };

  const initFormValue = (ref) => {
    ref?.current.resetFields();
    ref?.current.setFieldsValue({
      ...ref?.current.getFieldsValue(),
      assetPurchasedDate: dayjs(),
      createdAt: dayjs(), // 현재 날짜를 dayjs 객체로 설정
    });
    setAssetCount(0);
    setAssetCodes([]);
    setAssetAccessory([]);

    setIsDetailDescription(false);
  };

  const handleAssetName = (vendor, model, ref) => {
    let modelVendor = "";
    let modelModel = "";
    if (vendor !== undefined) {
      modelVendor = vendor;
    }
    if (model !== undefined) {
      modelModel = model;
    }
    const assetName = `${modelVendor} ${modelModel}`.trim();
    const newAccessory = {
      index: 1,
      name: modelModel,
      count: 1,
      action: <span>삭제불가</span>,
    };
    setAssetAccessory(() => [{ ...newAccessory }]);

    if (ref?.current) {
      ref?.current.setFieldsValue({
        ...ref?.current.getFieldsValue(),
        assetName,
      });
    }
  };

  //직접추가 부분 구현해야함
  const handleAddCustom = (type, value, original) => {
    const newMemberSettings = [...original];
    const newCategory = {
      depreciationType: "설정안함",
      depreciationPeroid: 0,
      name: value,
      key: original.length > 0 ? original.length + 1 : 0,
      productLine: [],
    };
    switch (type) {
      case "category":
        newMemberSettings.push({ ...newCategory });
        setAssetCategoriesList(() => [...newMemberSettings]);
        break;
      case "category":
        newMemberSettings.push({ ...newCategory });
        setAssetCategoriesList(() => [...newMemberSettings]);
        break;
      default:
        break;
    }
  };

  const handleAssetPicAdd = ({ newFile, index }) => {
    const newAssetCodes = [...assetCodes];
    const newFirstPics = [...newAssetCodes[index].firstPics];
    newFirstPics.push({ ...newFile });
    const newAssetValue = {
      ...newAssetCodes[index],
      firstPics: [...newFirstPics],
    };
    newAssetCodes.splice(index, 1, newAssetValue);
    setAssetCodes(() => [...newAssetCodes]);
  };

  const handleAssetPicUploadAdd = async ({
    file,
    onSuccess,
    onError,
    index,
  }) => {
    const newFileName = generateFileName(file.name, generateUUID());
    const storageUrl = `/assetPics/${memberSettings.userID}`;

    try {
      const result = await assetPicUpload.uploadImage(
        storageUrl,
        file,
        newFileName
      );
      handleAssetPicAdd({
        newFile: { storageUrl, name: newFileName, url: result.downloadUrl },
        index,
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      onError(error);
    }
  };

  const handleAssetInputs = (count = 0) => {
    if (count !== assetCount) {
      setAssetCount(count);

      const newAssets = Array.from({ length: count }, () => ({
        assetCode: generateUUID(),
        firstPics: [],
      }));

      setAssetCodes((prev) => (prev = newAssets));
    }
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

      form.setFieldValue("assetDepreciationType", filtered.depreciationType);
      form.setFieldValue(
        "assetDepreciationPeroid",
        filtered.depreciationPeriod
      );
    }
  };

  const handleCompanyOptions = (baseCompany, childrenArray) => {
    const childs = childrenArray.map((child, cIdx) => {
      const childValue = { key: cIdx + 1, label: child, value: child };
      return childValue;
    });
    const options = [
      { key: 0, label: baseCompany, value: baseCompany },
      ...childs,
    ];

    return options;
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

  useEffect(() => {
    initFormValue(formRef);
  }, []);

  useEffect(() => {
    if (memberSettings?.assetCategories) {
      setAssetCategoriesList(() => [...memberSettings.assetCategories]);

      setAssetCategoryOptions(() =>
        handleAssetOptions([...memberSettings.assetCategories])
      );
      setCompanyList(() =>
        handleCompanyOptions(
          memberSettings.companyName,
          memberSettings.companyChildren
        )
      );
      form.setFieldValue("assetOwnerCompany", memberSettings.companyName);
    }
  }, [memberSettings]);

  useEffect(() => {
    const inputs = assetCodes.map(renderInput);
    setAssetInputs(inputs);
  }, [assetCodes]); // assetCodes가 변경될 때마다 실행됩니다.

  useEffect(() => {
    if (currentProductLine !== "") {
    }
  }, [currentProductLine]);

  const Inputs = [
    {
      key: 1,
      children: [
        {
          index: 1,
          type: "select",
          label: "",
          name: "assetCategory",
          style: { width: 160 },
        },
      ],
    },
  ];

  return (
    <div
      className="flex w-full h-full flex-col rounded-lg"
      style={{
        backgroundColor: "#fff",
        minHeight: "100%",
      }}
    >
      <div className="flex w-full ">
        <ContentTitle title="자산추가" />
      </div>
      <div className="flex w-full flex-col lg:flex-row gap-2">
        <div className="flex w-full lg:w-1/2 justify-center items-center px-5 ">
          <div
            className="flex border w-full h-full rounded-lg p-5 "
            style={{ minHeight: "150px" }}
          >
            <Form
              labelCol={{
                span: 5,
              }}
              style={{
                width: "100%",
              }}
              labelAlign="right"
              ref={formRef}
              onFinish={handleFinish}
              autoComplete="off"
              form={form}
            >
              <Form.Item label="분류" required>
                <Space className="w-full">
                  <Form.Item name="assetCategory" noStyle>
                    {/* <AutoComplete options={[...assetCategoryOptions]}>
                      <Input />
                    </AutoComplete> */}
                    <Select
                      style={{ width: 160 }}
                      onChange={() =>
                        formRef?.current &&
                        filterProductLine(
                          formRef?.current.getFieldsValue().assetCategory,
                          memberSettings
                        )
                      }
                      //onChange={(value) => setCurrentCategory(() => value)}
                      options={assetCategoriesList.map((category, cIdx) => ({
                        label: category.name,
                        value: category.name,
                      }))}
                      // dropdownRender={(menu) => (
                      //   <>
                      //     {menu}
                      //     <Divider
                      //       style={{
                      //         margin: "8px 0",
                      //       }}
                      //     />
                      //     <Space
                      //       style={{
                      //         padding: "0 8px 4px",
                      //       }}
                      //     >
                      //       <Input
                      //         placeholder="대분류명"
                      //         ref={addCategoryRef}
                      //         value={categoryInput}
                      //         onChange={(e) => {
                      //           setCategoryInput(() => e.target.value);
                      //         }}
                      //       />

                      //       <Button
                      //         type="text"
                      //         icon={<PlusOutlined />}
                      //         onClick={() =>
                      //           handleAddCustom(
                      //             "category",
                      //             categoryInput,
                      //             assetCategoriesList
                      //           )
                      //         }
                      //       />
                      //     </Space>
                      //   </>
                      // )}
                    />
                  </Form.Item>
                  {formRef?.current?.getFieldsValue().assetCategory !== "" &&
                    productLineList.length > 0 && (
                      <Form.Item name="assetProductLine" noStyle>
                        <Select
                          style={{ width: 160 }}
                          dropdownRender={(menu) => <>{menu}</>}
                          onChange={(value) => {
                            setCurrentProductLine(value);
                            assetVendorRef?.current.focus({
                              cursor: "all",
                            });
                          }}
                          value={currentProductLine}
                          options={productLineList.map((product, pIdx) => ({
                            label: product,
                            value: product,
                          }))}
                        />
                      </Form.Item>
                    )}
                </Space>
              </Form.Item>
              <Form.Item
                name="assetVendor"
                label="제조사"
                rules={[
                  {
                    required: true,
                    message: "제조사가 없거나 미확인시 매입처를 입력해주세요.",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  ref={assetVendorRef}
                  value={assetVendor}
                  onChange={(e) => {
                    e.preventDefault();
                    setAssetVendor(() => e.target.value);
                  }}
                  onPressEnter={() =>
                    assetModelRef?.current.focus({
                      cursor: "all",
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                name="assetModel"
                label="모델명"
                rules={[
                  {
                    required: true,
                    message: "모델명이 없다면 품목으로 작성해주세요.",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  value={assetModel}
                  ref={assetModelRef}
                  onChange={(e) => {
                    e.preventDefault();
                    setAssetModel(() => e.target.value);
                  }}
                  onPressEnter={() =>
                    assetNameRef?.current.focus({
                      cursor: "all",
                    })
                  }
                />
              </Form.Item>

              <Form.Item
                name="assetName"
                label="자산명"
                rules={[
                  {
                    required: true,
                    message: "제조사와 모델명을 입력하면 자동 생성됩니다.",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  ref={assetNameRef}
                  onFocus={() =>
                    handleAssetName(
                      formRef?.current.getFieldsValue()?.assetVendor,
                      formRef?.current.getFieldsValue()?.assetModel,
                      formRef
                    )
                  }
                  onPressEnter={() =>
                    assetWarrantyRef?.current.focus({
                      cursor: "all",
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                name="assetWarranty"
                label="보증기간"
                help="＊보증기간이 만료되었거나 알수없는 경우 0으로 입력하세요."
              >
                <InputNumber
                  //onChange={(value) => setAssetWarranty(value)}
                  style={{ width: "150px", maxWidth: "100%" }}
                  ref={assetWarrantyRef}
                  addonAfter={<span>개월</span>}
                  onPressEnter={() =>
                    assetDescritionSummayRef?.current.focus({
                      cursor: "all",
                    })
                  }
                />
              </Form.Item>
              {/* <Form.Item name="isAssetDetail" label="상세스펙">
                <Switch
                  onChange={(checked) => {
                    setIsDetailDescription(checked);
                  }}
                />
              </Form.Item> */}
              <Form.Item name="assetDescritionSummay" label="간단스펙">
                <TextArea ref={assetDescritionSummayRef} />
              </Form.Item>
              <Form.Item
                name="assetPurchaseName"
                label="매입처"
                rules={[
                  {
                    required: true,
                    message:
                      "매입처를 입력해주세요. 무상매입의 경우 무상으로 입력해주세요.",
                  },
                ]}
              >
                <Input
                  ref={assetPurchaseNameRef}
                  style={{ width: "100%" }}
                  onPressEnter={() =>
                    assetOwnerCompanyRef?.current.focus({
                      cursor: "all",
                    })
                  }
                />
              </Form.Item>

              <Form.Item
                name="assetOwnerCompany"
                label="자산소유사"
                rules={[
                  {
                    required: true,
                    message: "자회사가 없는경우 회사명을 선택해주세요.",
                  },
                ]}
              >
                {/* <Input style={{ width: "100%" }} /> */}
                <Select
                  options={[...companyList]}
                  style={{ width: "100%" }}
                  defaultValue={memberSettings?.companyName}
                  ref={assetOwnerCompanyRef}
                  onPressEnter={() =>
                    assetCostRef?.current.focus({
                      cursor: "all",
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="감가방식">
                <Space className="w-full">
                  <Form.Item name="assetDepreciationType" noStyle>
                    <Select
                      options={[...initDepreciationType]}
                      ref={assetDepreciationTypeRef}
                      defaultValue="설정안함"
                      onChange={() => {
                        setAssetDepreciationType(
                          form.getFieldValue("assetDepreciationType")
                        );
                      }}
                    />
                  </Form.Item>
                  {assetDepreciationType === "정액법" && (
                    <Form.Item name="assetDepreciationPeroid" noStyle>
                      <Select
                        options={[...initDepreciationPeriod]}
                        defaultValue={0}
                      />
                    </Form.Item>
                  )}
                  {assetDepreciationType === "정률법" && (
                    <Form.Item name="assetDepreciationPeroid" noStyle>
                      <Select
                        options={[...initDepreciationRate]}
                        defaultValue={0}
                      />
                    </Form.Item>
                  )}
                  {assetDepreciationType === "설정안함" && (
                    <Form.Item name="assetDepreciationPeroid" noStyle>
                      <Select
                        options={[
                          { key: "설정안함", value: 0, label: "설정안함" },
                        ]}
                        defaultValue={0}
                      />
                    </Form.Item>
                  )}
                </Space>
              </Form.Item>
              <Form.Item
                name="assetCost"
                label="취득원가"
                rules={[
                  { required: true, message: "취득원가를 입력해주세요." },
                ]}
                help="＊부가세를 제외한 금액을 단가로 입력해주세요."
              >
                <Input
                  addonAfter="원"
                  style={{
                    width: "70%",
                    textAlign: "right",
                    paddingRight: "20px",
                  }}
                  ref={assetCostRef}
                  onFocus={() => assetCostRef.current.focus({ cursor: "all" })}
                  onChange={(e) => {
                    console.log(NumberWithComma(e.target.value));

                    form.setFieldValue(
                      "assetCost",
                      NumberWithComma(e.target.value)
                    );
                  }}
                  onPressEnter={() =>
                    assetCountRef?.current.focus({
                      cursor: "all",
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                name="assetCount"
                label="수량"
                rules={[
                  {
                    required: true,
                    message: "취득수량을 숫자형태로 입력해주세요.",
                  },
                ]}
                help="100개 이상은 나눠서 등록해주세요."
              >
                <InputNumber
                  ref={assetCountRef}
                  max={100}
                  onChange={handleAssetInputs}
                  onPressEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              </Form.Item>
              <Form.Item
                name="assetPurchasedDate"
                label="입고일자"
                rules={[
                  {
                    required: true,
                    message:
                      "입고일자를 모르는 경우 오늘이나, 최대한 비슷한 날짜로 입력해주세요.",
                  },
                ]}
              >
                <DatePicker
                  ref={assetPurchasedDateRef}
                  locale={locale}
                  defaultValue={dayjs()} // 현재 날짜로 설정
                  format="YYYY-MM-DD" // 필요에 따라 형식 지정
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      createAtRef?.current.focus({
                        cursor: "all",
                      });
                    }
                  }}
                />
              </Form.Item>
              <Form.Item name="createdAt" label="등록일자">
                <DatePicker
                  ref={createAtRef}
                  locale={locale}
                  defaultValue={dayjs()} // 현재 날짜로 설정
                  format="YYYY-MM-DD" // 필요에 따라 형식 지정
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      assetAccessoryNameRef?.current.focus({
                        cursor: "all",
                      });
                    }
                  }}
                />
              </Form.Item>
              <div className="flex w-full justify-end items-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-500"
                >
                  저장
                </Button>
              </div>
            </Form>
          </div>
        </div>
        <div className="flex w-full lg:w-1/2 justify-center items-center px-5 ">
          <div
            className="flex border w-full h-full rounded-lg p-5 flex-col gap-y-2"
            style={{ minHeight: "150px" }}
          >
            {isDetailDescription && (
              <AssetDescription propProductLine={currentProductLine} />
            )}
            <Card title="구성품" className="w-full">
              {assetAccessory.length > 0 && (
                <>
                  <div className="flex flex-col lg:flex-row mb-2 gap-2">
                    <Input
                      placeholder="품목"
                      ref={assetAccessoryNameRef}
                      value={currentAssetAccessory.name}
                      onChange={(e) => {
                        setCurrentAssetAccessory(() => ({
                          ...currentAssetAccessory,
                          name: e.target.value.trim(),
                        }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          assetAccessoryCountRef?.current.focus({
                            cursor: "all",
                          });
                        }
                      }}
                    />
                    <div className="flex mt-2 lg:mt-0 lg:gap-2">
                      <InputNumber
                        placeholder="수량"
                        ref={assetAccessoryCountRef}
                        value={currentAssetAccessory.count}
                        onChange={(value) => {
                          setCurrentAssetAccessory(() => ({
                            ...currentAssetAccessory,
                            count: parseInt(value) || 1,
                          }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault(); // 기본 동작 방지
                            handleAssetAccessoryAdd();
                          }
                        }}
                      />
                      <Button
                        ref={assetAccessorAddRef}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault(); // 기본 동작 방지
                            handleAssetAccessoryAdd();
                          }
                        }}
                        onClick={() => {
                          handleAssetAccessoryAdd();
                        }}
                        icon={<PlusOutlined />}
                      >
                        추가
                      </Button>
                    </div>
                  </div>
                  <Table
                    size="small"
                    columns={[
                      {
                        key: 1,
                        dataIndex: "index",
                        title: "순번",
                        width: "15%",
                      },
                      {
                        key: 2,
                        dataIndex: "name",
                        title: "품목",
                        width: "55%",
                      },
                      {
                        key: 3,
                        dataIndex: "count",
                        title: "수량",
                        width: "15%",
                      },
                      {
                        key: 4,
                        dataIndex: "action",
                        title: "품목삭제",
                        width: "15%",
                      },
                    ]}
                    dataSource={assetAccessory}
                    pagination={false}
                  />
                </>
              )}
            </Card>
            <Card title="자산코드" className="w-full">
              <div className="flex w-full justify-start items-center flex-col gap-y-2">
                {assetInputs.length > 0 &&
                  assetInputs.map((input, iIdx) => {
                    return (
                      <div
                        className="flex w-full h-auto p-2 rounded"
                        style={{ border: "1px solid #e6e6e6" }}
                      >
                        <div
                          className="flex justify-center items-center"
                          style={{ width: "50px" }}
                        >
                          {iIdx + 1}
                        </div>
                        <div className="flex w-full">{input}</div>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </div>
        </div>
      </div>
      {contextHolder}
    </div>
  );
};

export default NewAsset;
