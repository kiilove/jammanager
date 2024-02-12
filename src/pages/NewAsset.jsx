import React, { useContext, useEffect, useRef, useState } from "react";
import { ContentTitle } from "../commonstyles/Title";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Upload,
  notification,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import { generateFileName, generateUUID } from "../functions";
import { Timestamp } from "firebase/firestore";
import { useFirestoreAddData } from "../hooks/useFirestore";
import { CurrentLoginContext } from "../context/CurrentLogin";
import useImageUpload from "../hooks/useFireStorage";

const NewAsset = () => {
  const formRef = useRef();
  const assetAdd = useFirestoreAddData();
  const [assetInputs, setAssetInputs] = useState([]);
  const [assetCodes, setAssetCodes] = useState([]);
  const [assetCodePics, setAssetCodePics] = useState([[]]);
  const [assetCategoriesList, setAssetCategoriesList] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentCategoryInfo, setCurrentCategoryInfo] = useState({});
  const [currentProductLine, setCurrentProductLine] = useState("");
  const [productLineList, setProductLineList] = useState([]);
  const [productLineDescription, setProductLineDescription] = useState({});
  const [assetCount, setAssetCount] = useState(0);
  const [assetVendor, setAssetVendor] = useState("");
  const [assetModel, setAssetModel] = useState("");
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

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFinish = (values) => {
    console.log(values);
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

    // userEnteringDate와 createdAt 필드 추가
    newValue.assetPurchasedDate = assetPurchasedDate;
    newValue.createdAt = createdAtValue;
    newValue.location = "출고대기";
    newValue.userInfo = "미배정";
    delete newValue.assetCount;

    if (assetCodes.length > 0) {
      assetCodes.map(async (asset, cIdx) => {
        const codeWithValue = {
          assetCode: asset.assetCode,
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
  };

  const handleAssetName = (vendor, model, ref) => {
    const assetName = `${vendor} ${model}`.trim();

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
            style={{ width: "90%" }}
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
    }
  };

  useEffect(() => {
    initFormValue(formRef);
  }, []);

  useEffect(() => {
    if (memberSettings?.assetCategories) {
      setAssetCategoriesList(() => [...memberSettings.assetCategories]);
    }
  }, [memberSettings]);

  useEffect(() => {
    const inputs = assetCodes.map(renderInput);
    setAssetInputs(inputs);
  }, [assetCodes]); // assetCodes가 변경될 때마다 실행됩니다.

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
      <div className="flex w-full flex-col lg:flex-row">
        <div className="flex w-full lg:w-1/2 justify-center items-center px-5 ">
          <div
            className="flex border w-full h-full rounded-lg p-5 "
            style={{ minHeight: "150px" }}
          >
            <Form
              labelCol={{
                span: 4,
              }}
              style={{
                width: "100%",
              }}
              labelAlign="right"
              ref={formRef}
              onFinish={handleFinish}
              autoComplete="off"
            >
              <Form.Item name="assetCategory" label="분류">
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
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider
                        style={{
                          margin: "8px 0",
                        }}
                      />
                      <Space
                        style={{
                          padding: "0 8px 4px",
                        }}
                      >
                        <Input
                          placeholder="대분류명"
                          ref={addCategoryRef}
                          value={categoryInput}
                          onChange={(e) => {
                            setCategoryInput(() => e.target.value);
                          }}
                          // onKeyDown={(e) => e.stopPropagation()}
                        />
                        {/* 버튼을 클릭했을때 assetCategoriesList변경해야함, productLine을 일단 빈배열로 세팅 */}
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() =>
                            handleAddCustom(
                              "category",
                              categoryInput,
                              assetCategoriesList
                            )
                          }
                        />
                      </Space>
                    </>
                  )}
                />
              </Form.Item>
              {formRef?.current?.getFieldsValue().assetCategory !== "" &&
                productLineList.length > 0 && (
                  <Form.Item label="품목" name="assetProductLine">
                    <Select
                      style={{ width: 160 }}
                      dropdownRender={(menu) => <>{menu}</>}
                      onChange={(value) => setCurrentProductLine(value)}
                      value={currentProductLine}
                      options={productLineList.map((product, pIdx) => ({
                        label: product,
                        value: product,
                      }))}
                    />
                  </Form.Item>
                )}
              <Form.Item name="assetVendor" label="제조사">
                <Input
                  style={{ width: "90%" }}
                  onChange={(e) => setAssetVendor(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="assetModel" label="모델명">
                <Input
                  style={{ width: "90%" }}
                  onChange={(e) => setAssetModel(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="assetName" label="자산명">
                <Input
                  style={{ width: "90%" }}
                  onFocus={() =>
                    handleAssetName(
                      formRef?.current.getFieldsValue()?.assetVendor,
                      formRef?.current.getFieldsValue()?.assetModel,
                      formRef
                    )
                  }
                />
              </Form.Item>
              <Form.Item name="assetPurchaseName" label="매입처">
                <Input style={{ width: "90%" }} />
              </Form.Item>
              <Form.Item name="assetCount" label="수량">
                <InputNumber onChange={handleAssetInputs} />
              </Form.Item>
              <Form.Item name="assetPurchasedDate" label="입고일자">
                <DatePicker
                  locale={locale}
                  defaultValue={dayjs()} // 현재 날짜로 설정
                  format="YYYY-MM-DD" // 필요에 따라 형식 지정
                />
              </Form.Item>
              <Form.Item name="createdAt" label="등록일자">
                <DatePicker
                  locale={locale}
                  defaultValue={dayjs()} // 현재 날짜로 설정
                  format="YYYY-MM-DD" // 필요에 따라 형식 지정
                />
              </Form.Item>
              <Card title="자산코드">
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
            className="flex border w-full h-full rounded-lg p-5 "
            style={{ minHeight: "150px" }}
          ></div>
        </div>
      </div>
      {contextHolder}
    </div>
  );
};

export default NewAsset;
