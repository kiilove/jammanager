import React, { useContext, useEffect, useRef, useState } from "react";
import { ContentTitle } from "../commonstyles/Title";

import { RiDeleteBin5Line } from "react-icons/ri";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Card,
  Form,
  Input,
  List,
  Popconfirm,
  Result,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Upload,
  notification,
} from "antd";
import useImageUpload from "../hooks/useFireStorage";
import { generateFileName, generateUUID } from "../functions";
import "./AutoComplete.css";
import { CurrentLoginContext } from "../context/CurrentLogin";
import useFirebaseAuth from "../hooks/useFireAuth";
import { useFirestoreUpdateData } from "../hooks/useFirestore";
import { initDepreciationPeriod, initDepreciationType } from "../InitValues";

const initUserStatus = ["재직", "파견", "휴직", "퇴사"];
const initUserJob = ["정직원", "계약직", "임시직", "프리랜서", "외부직원"];
const initCategory = ["전산장비", "소프트웨어", "가구", "기타"];
const initCategory2 = [
  {
    key: 1,
    name: "전산장비",
    depreciationType: "설정안함",
    depreciationPeriod: 0,
  },
  {
    key: 2,
    name: "소프트웨어",
    depreciationType: "설정안함",
    depreciationPeriod: 0,
  },
  { key: 3, name: "가구", depreciationType: "설정안함", depreciationPeriod: 0 },
  { key: 4, name: "기타", depreciationType: "설정안함", depreciationPeriod: 0 },
];
const ServiceSetting = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isCompanyChildren, setIsCompanyChildren] = useState(false);
  const [companyChildrenInput, setCompanyChildrenInput] = useState("");
  const [companyChildrenEditMode, setCompanyChildrenEditMode] = useState(false);
  const [companyChildrenList, setCompanyChildrenList] = useState([]);
  const [companyLogoFile, setCompanyLogoFile] = useState([]);
  const companyLogoUpload = useImageUpload();

  const [userStatusList, setUserStatusList] = useState([]);
  const [userStatusInput, setUserStatusInput] = useState();
  const [userJobList, setUserJobList] = useState([]);
  const [userJobInput, setUserJobInput] = useState();

  const [assetCategoryList, setAssetCategoryList] = useState([]);
  const [assetCategoryInput, setAssetCategoryInput] = useState();

  const companyChildrenRef = useRef();
  const userStatusRef = useRef();
  const userJobRef = useRef();
  const companyRef = useRef();
  const userRef = useRef();
  const assetRef = useRef();
  const [form] = Form.useForm();

  const { loginInfo, memberSettings, setMemberSettings } =
    useContext(CurrentLoginContext);

  const { logOut } = useFirebaseAuth;
  const settingsUpdate = useFirestoreUpdateData();

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

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        업로드
      </div>
    </div>
  );

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleCompanyLogoFileAdd = (newFile) => {
    setCompanyLogoFile([...companyLogoFile, newFile]);
  };

  const handleCompanyLogoFileRemove = async (file) => {
    await companyLogoUpload.deleteFileFromStorage(`/companyLogos/${file.name}`);

    const newFileList = companyLogoFile.filter((item) => item.uid !== file.uid);
    setCompanyLogoFile(newFileList);
  };

  const handleCompanyLogoUploadAdd = async ({ file, onSuccess, onError }) => {
    const newFileName = generateFileName(file.name, generateUUID());

    try {
      const result = await companyLogoUpload.uploadImage(
        "/companyLogos/",
        file,
        newFileName
      );
      handleCompanyLogoFileAdd({
        uid: result.filename,
        name: newFileName,
        url: result.downloadUrl,
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      onError(error);
    }
  };

  const handleChildrenRemove = (idx, list, setList, setInput) => {
    const newList = [...list];
    newList.splice(idx, 1);
    setList(() => [...newList]);
    setInput("");
  };

  const handleAssetCategory = (idx, key, value, list, setList) => {
    const newList = [...list];
    const newValue = { ...newList[idx], [key]: value };
    newList.splice(idx, 1, newValue);
    setList(() => [...newList]);
  };

  const handleUpdateSettings = async (id, value) => {
    try {
      await settingsUpdate.updateData("memberSetting", id, value, (data) => {
        setMemberSettings(() => ({ ...data }));
        setIsLoading(false);
        openNotification(
          "success",
          "업데이트 성공",
          "정상적으로 업데이트 되었습니다.",
          "top",
          3
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSettingInfo = (data) => {
    setIsLoading(true);
    const settings = {
      ...data,
      ...companyRef?.current.getFieldsValue(),
      companyChildren: [...companyChildrenList],
      companyLogo: [...companyLogoFile],
      userStatus: [...userStatusList],
      userJobLs: [...userJobList],
      assetCategories: [...assetCategoryList],
      // ownUser: loginInfo.uid,
    };
    delete settings.id;
    delete settings.companyChildrenName;
    console.log(settings);
    handleUpdateSettings(data.id, settings);
  };

  useEffect(() => {
    console.log(memberSettings);
    const timer = setTimeout(() => {
      if (!memberSettings) {
        // 3초 후 currentUser가 없다면 로그인 상태가 아니라고 판단
        setIsLoading(false);
        // 로그인 페이지에 머물도록 특별한 액션이 필요 없음
      }
    }, 3000);
    if (memberSettings?.companyName) {
      const promises = [
        setCompanyLogoFile(() => [...memberSettings.companyLogo]),
        setCompanyChildrenList(() => [...memberSettings.companyChildren]),
        setIsCompanyChildren(memberSettings.isCompanyChildren),
        form?.setFieldValue("companyName", memberSettings.companyName),
        form?.setFieldValue(
          "isCompanyChildren",
          memberSettings.isCompanyChildren
        ),
        setUserJobList(() => [...memberSettings.userJobs]),
        setUserStatusList(() => [...memberSettings.userStatus]),
        setAssetCategoryList(() => [...memberSettings.assetCategories]),
        clearTimeout(timer),
      ];
      Promise.all(promises).then(() => {
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timer);
  }, [memberSettings]);

  return (
    <>
      {isLoading && (
        <div className="w-full h-screen flex justify-center items-center">
          <Spin />
        </div>
      )}
      {!isLoading && !memberSettings?.companyName && (
        <div className="w-full h-screen flex justify-center items-center">
          <Result
            status="error"
            title="회원정보 오류"
            subTitle={`회원정보를 불러오는데 문제가 발생했습니다. ${(
              <br />
            )}다시 한번 로그인 시도해주세요. ${(
              <br />
            )}문제가 계속 반복된다면 jbkim@jncore.com으로 이메일 부탁드립니다.`}
            extra={[
              <Button
                key="logout"
                onClick={() => {
                  logOut();
                }}
              >
                다시 로그인
              </Button>,
            ]}
          />
        </div>
      )}
      {!isLoading && (
        <div
          className="flex w-full h-full flex-col rounded-lg"
          style={{
            backgroundColor: "#fff",
            minHeight: "100%",
          }}
        >
          <div className="flex w-full ">
            <ContentTitle title="환경설정" titleColor="#000" />
          </div>
          <div className="flex w-full px-5">
            <Button onClick={() => handleSettingInfo(memberSettings)}>
              저장
            </Button>
          </div>
          <div className="flex w-full h-full flex-wrap p-4 gap-2">
            <div
              className="flex w-full md:w-1/2 lg:w-1/3"
              style={{ maxWidth: "540px" }}
            >
              <Card
                title="회사설정"
                size="small"
                className="w-full "
                headStyle={{ backgroundColor: "#efeff0", color: "#000000" }}
              >
                <Form
                  labelCol={{
                    span: 6,
                  }}
                  style={{
                    width: "100%",
                  }}
                  labelAlign="right"
                  ref={companyRef}
                  form={form}
                  layout="vertical"
                >
                  <Form.Item name="companyLogo" label="회사로고">
                    <Upload
                      listType="picture-card"
                      fileList={companyLogoFile}
                      onPreview={handlePreview}
                      onRemove={handleCompanyLogoFileRemove}
                      customRequest={handleCompanyLogoUploadAdd}
                    >
                      {companyLogoFile.length >= 2 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                  <Form.Item
                    name="companyName"
                    label="회사명"
                    initialValue={memberSettings.companyName}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="isCompanyChildren"
                    label="자회사보유"
                    initialValue={memberSettings.isCompanyChildren}
                  >
                    <Switch
                      checked={isCompanyChildren}
                      onChange={(value) => setIsCompanyChildren(value)}
                    />
                  </Form.Item>
                  {isCompanyChildren && (
                    <Form.Item label="자회사관리">
                      {companyChildrenEditMode ? (
                        <Form.Item noStyle name="companyChildrenName">
                          <Space.Compact>
                            <Input placeholder="회사명" />
                            <Button>m</Button>
                            <Button>수정</Button>
                          </Space.Compact>
                        </Form.Item>
                      ) : (
                        <Form.Item noStyle name="companyChildrenName">
                          <List
                            size="small"
                            bordered
                            header={
                              <div className="flex w-full justify-start gap-x-2">
                                <Input
                                  placeholder="자회사명"
                                  onChange={(e) =>
                                    setCompanyChildrenInput(e.target.value)
                                  }
                                  value={companyChildrenInput}
                                  ref={companyChildrenRef}
                                  onKeyDown={(e) => {
                                    const list = [...companyChildrenList];
                                    if (
                                      e.key === "Enter" &&
                                      companyChildrenRef?.current?.input.value
                                    ) {
                                      const list = [...companyChildrenList];
                                      list.push(
                                        companyChildrenRef?.current.input.value
                                      );
                                      setCompanyChildrenList([...list]);
                                      setCompanyChildrenInput("");
                                    }
                                  }}
                                />
                                <Button
                                  onClick={() => {
                                    const list = [...companyChildrenList];

                                    list.push(
                                      companyChildrenRef?.current.input.value
                                    );

                                    setCompanyChildrenList([...list]);
                                    setCompanyChildrenInput("");
                                  }}
                                >
                                  추가
                                </Button>
                              </div>
                            }
                            dataSource={companyChildrenList}
                            renderItem={(item, iIdx) => (
                              <List.Item
                                actions={[
                                  <Popconfirm
                                    title="삭제"
                                    description="자회사를 삭제하시겠습니까?"
                                    onConfirm={() =>
                                      handleChildrenRemove(
                                        iIdx,
                                        companyChildrenList,
                                        setCompanyChildrenList,
                                        setCompanyChildrenInput
                                      )
                                    }
                                    onCancel={() => {
                                      return;
                                    }}
                                    okText="예"
                                    cancelText="아니오"
                                    okType="default"
                                  >
                                    <Button danger style={{ border: 0 }}>
                                      <RiDeleteBin5Line />
                                    </Button>
                                  </Popconfirm>,
                                ]}
                              >
                                {item}
                              </List.Item>
                            )}
                          />
                        </Form.Item>
                      )}
                    </Form.Item>
                  )}
                </Form>
              </Card>
            </div>
            <div
              className="flex w-full md:w-1/2 lg:w-1/3"
              style={{ maxWidth: "540px" }}
            >
              <Card
                title="구성원설정"
                size="small"
                className="w-full "
                headStyle={{ backgroundColor: "#efeff0", color: "#000000" }}
              >
                <Form
                  labelCol={{
                    span: 8,
                  }}
                  style={{
                    width: "100%",
                  }}
                  labelAlign="right"
                  ref={userRef}
                  layout="vertical"
                >
                  <Form.Item name="userStateList" label="재직상태종류">
                    <List
                      bordered
                      size="small"
                      dataSource={userStatusList}
                      header={
                        <div className="flex w-full justify-start gap-x-2">
                          <Input
                            placeholder="재직종류"
                            onChange={(e) => setUserStatusInput(e.target.value)}
                            value={userStatusInput}
                            ref={userStatusRef}
                            onKeyDown={(e) => {
                              const list = [...userStatusList];
                              if (
                                e.key === "Enter" &&
                                userStatusRef?.current?.input.value
                              ) {
                                const list = [...userStatusList];
                                list.push(userStatusRef?.current.input.value);
                                setUserStatusList([...list]);
                                setUserStatusInput("");
                              }
                            }}
                          />
                          <Button
                            onClick={() => {
                              const list = [...userStatusList];
                              list.push(userStatusRef?.current.input.value);
                              setUserStatusList([...list]);
                              setUserStatusInput("");
                            }}
                          >
                            추가
                          </Button>
                        </div>
                      }
                      renderItem={(item, iIdx) => (
                        <List.Item
                          actions={[
                            <Popconfirm
                              title="삭제"
                              description="재직상태종류를 삭제하시겠습니까?"
                              onConfirm={() =>
                                handleChildrenRemove(
                                  iIdx,
                                  userStatusList,
                                  setUserStatusList,
                                  setUserStatusInput
                                )
                              }
                              onCancel={() => {
                                return;
                              }}
                              okText="예"
                              cancelText="아니오"
                              okType="default"
                            >
                              <Button danger style={{ border: 0 }}>
                                <RiDeleteBin5Line />
                              </Button>
                            </Popconfirm>,
                          ]}
                        >
                          {item}
                        </List.Item>
                      )}
                    ></List>
                  </Form.Item>
                  <Form.Item name="userStateList" label="근무형태종류">
                    <List
                      bordered
                      size="small"
                      dataSource={userJobList}
                      header={
                        <div className="flex w-full justify-start gap-x-2">
                          <Input
                            placeholder="근무종류"
                            onChange={(e) => setUserStatusInput(e.target.value)}
                            value={userJobInput}
                            ref={userJobRef}
                            onKeyDown={(e) => {
                              const list = [...userJobList];
                              if (
                                e.key === "Enter" &&
                                userJobRef?.current?.input.value
                              ) {
                                const list = [...userJobList];
                                list.push(userJobRef?.current.input.value);
                                setUserJobList([...list]);
                                setUserJobInput("");
                              }
                            }}
                          />
                          <Button
                            onClick={() => {
                              const list = [...userJobList];
                              list.push(userJobRef?.current.input.value);
                              setUserJobList([...list]);
                              setUserJobInput("");
                            }}
                          >
                            추가
                          </Button>
                        </div>
                      }
                      renderItem={(item, iIdx) => (
                        <List.Item
                          actions={[
                            <Popconfirm
                              title="삭제"
                              description="재직상태종류를 삭제하시겠습니까?"
                              onConfirm={() =>
                                handleChildrenRemove(
                                  iIdx,
                                  userJobList,
                                  setUserJobList,
                                  setUserJobInput
                                )
                              }
                              onCancel={() => {
                                return;
                              }}
                              okText="예"
                              cancelText="아니오"
                              okType="default"
                            >
                              <Button danger style={{ border: 0 }}>
                                <RiDeleteBin5Line />
                              </Button>
                            </Popconfirm>,
                          ]}
                        >
                          {item}
                        </List.Item>
                      )}
                    ></List>
                  </Form.Item>
                </Form>
              </Card>
            </div>
            <div
              className="flex w-full md:w-1/2 lg:w-1/3"
              style={{ maxWidth: "540px" }}
            >
              <Card
                title="자산설정"
                size="small"
                className="w-full "
                headStyle={{ backgroundColor: "#efeff0", color: "#000000" }}
              >
                <Form
                  labelCol={{
                    span: 6,
                  }}
                  style={{
                    width: "100%",
                  }}
                  labelAlign="right"
                  size="small"
                  ref={assetRef}
                >
                  <Form.Item name="assetCategory">
                    <List
                      bordered
                      size="small"
                      dataSource={assetCategoryList}
                      header={
                        <div className="flex w-full justify-start gap-x-2">
                          <Input
                            placeholder="자산종류"
                            onChange={(e) =>
                              setAssetCategoryInput(e.target.value)
                            }
                            value={assetCategoryInput}
                            ref={assetRef}
                            onKeyDown={(e) => {
                              const list = [...assetCategoryList];
                              if (
                                e.key === "Enter" &&
                                assetRef?.current?.input.value
                              ) {
                                const list = [...assetCategoryList];
                                const newValue = {
                                  key: list.length + 1,
                                  name: assetRef?.current.input.value,
                                  depreciationType: "설정안함",
                                  depreciationPeriod: 0,
                                };
                                list.push({ ...newValue });
                                setAssetCategoryList([...list]);
                                setAssetCategoryInput("");
                              }
                            }}
                          />
                          <Button
                            onClick={() => {
                              const list = [...assetCategoryList];
                              const newValue = {
                                key: list.length + 1,
                                name: assetRef?.current.input.value,
                                depreciationType: "설정안함",
                                depreciationPeriod: 0,
                              };
                              list.push({ ...newValue });
                              setAssetCategoryList([...list]);
                              setAssetCategoryInput("");
                            }}
                          >
                            추가
                          </Button>
                        </div>
                      }
                      renderItem={(item, iIdx) => {
                        return (
                          <List.Item
                            actions={[
                              <Popconfirm
                                title="삭제"
                                description="자산종류를 삭제하시겠습니까?"
                                onConfirm={() =>
                                  handleChildrenRemove(
                                    iIdx,
                                    assetCategoryList,
                                    setAssetCategoryList,
                                    setAssetCategoryInput
                                  )
                                }
                                onCancel={() => {
                                  return;
                                }}
                                okText="예"
                                cancelText="아니오"
                                okType="default"
                              >
                                <Button danger style={{ border: 0 }}>
                                  <RiDeleteBin5Line />
                                </Button>
                              </Popconfirm>,
                            ]}
                          >
                            <div className="flex w-full h-auto justify-center items-start flex-wrap flex-col">
                              <div className="flex w-full">
                                <Form.Item
                                  name={`assetDepreciationName_${item.key}`}
                                  value={item}
                                  label="자산분류:"
                                  style={{ fontSize: "10px" }}
                                >
                                  {item.name}
                                </Form.Item>
                              </div>
                              <div className="flex w-full">
                                <div className="flex w-full">
                                  <Form.Item
                                    name={`assetDepreciationType_${item.key}`}
                                    label="감가방식"
                                    className="w-full"
                                  >
                                    <Select
                                      allowClear
                                      defaultValue={
                                        assetCategoryList[iIdx].depreciationType
                                      }
                                      onChange={(value) =>
                                        handleAssetCategory(
                                          iIdx,
                                          "depreciationType",
                                          value,
                                          assetCategoryList,
                                          setAssetCategoryList
                                        )
                                      }
                                      options={[...initDepreciationType]}
                                      className="w-full"
                                    />
                                  </Form.Item>
                                </div>
                              </div>
                              <div className="flex w-full">
                                <div className="flex w-full">
                                  <Form.Item
                                    name={`assetDepreciationPeriod_${item.key}`}
                                    label="감가기간"
                                    className="w-full"
                                  >
                                    <Select
                                      allowClear
                                      onChange={(value) =>
                                        handleAssetCategory(
                                          iIdx,
                                          "depreciationPeriod",
                                          value,
                                          assetCategoryList,
                                          setAssetCategoryList
                                        )
                                      }
                                      defaultValue={
                                        assetCategoryList[iIdx]
                                          .depreciationPeriod
                                      }
                                      options={[...initDepreciationPeriod]}
                                    />
                                  </Form.Item>
                                </div>
                              </div>
                            </div>
                          </List.Item>
                        );
                      }}
                    ></List>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      )}
      {contextHolder}
    </>
  );
};

export default ServiceSetting;
