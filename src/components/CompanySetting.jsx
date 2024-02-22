import {
  Button,
  Col,
  Form,
  Input,
  List,
  Popconfirm,
  Row,
  Space,
  Switch,
  Upload,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import useImageUpload from "../hooks/useFireStorage";
import { generateFileName, generateUUID } from "../functions";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CurrentLoginContext } from "../context/CurrentLogin";
import _ from "lodash";

const CompanySetting = ({ onUpdate }) => {
  const [isCompanyChildren, setIsCompanyChildren] = useState(false);
  const [companyNameInput, setCompanyNameInput] = useState("");
  const [companyChildrenInput, setCompanyChildrenInput] = useState("");
  const [companyChildrenEditMode, setCompanyChildrenEditMode] = useState(false);
  const [companyChildrenList, setCompanyChildrenList] = useState([]);
  const [companyLogoFile, setCompanyLogoFile] = useState([]);
  const [companyForm] = Form.useForm();
  const companyLogoUpload = useImageUpload();
  const { memberSettings } = useContext(CurrentLoginContext);
  const prevSettingsRef = useRef({
    companyName: "",
    isCompanyChildren: false,
    companyChildrenList: [],
    companyLogoFile: [],
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
      handleCompanyLogoState({
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

  const handleCompanyLogoState = (newFile) => {
    setCompanyLogoFile([...companyLogoFile, newFile]);
  };

  const handleChildrenAdd = (value, list, setState) => {
    const newList = [...list];
    newList.push(value);
    setState(() => [...newList]);
    companyForm.setFieldValue("companyChildrenName", "");
    setCompanyChildrenInput("");
  };
  const handleChildrenRemove = (idx, list, setState) => {
    const newList = [...list];
    newList.splice(idx, 1);
    setState(() => [...newList]);

    companyForm.setFieldValue("companyChildrenName", "");
    setCompanyChildrenInput("");
  };

  const handleFormValue = (value, formHook) => {
    const keyArray = Object.keys(value);

    if (keyArray.length > 0) {
      keyArray.map((key, kIdx) => {
        formHook?.setFieldValue(key, value[key]);
      });
    }
    setCompanyNameInput(value.companyName);
    setIsCompanyChildren(value.isCompanyChildren);
    setCompanyChildrenList([...value.companyChildren]);
    setCompanyLogoFile([...value.companyLogo]);
  };

  const requestUpdate = (value, msg) => {
    const newValue = {
      ...value,
      companyName: companyNameInput,
      companyLogo: [...companyLogoFile],
      isCompanyChildren,
      companyChildren: [...companyChildrenList],
    };

    onUpdate(value.id, newValue, msg);
  };

  const settingsHaveChanged = () => {
    const prevSettings = prevSettingsRef.current;
    return !_.isEqual(prevSettings, {
      companyName: companyNameInput,
      isCompanyChildren,
      companyChildrenList,
      companyLogoFile,
    });
  };

  useEffect(() => {
    handleFormValue(memberSettings, companyForm);
  }, [memberSettings]);

  useEffect(() => {
    //console.log(settingsHaveChanged());
    if (
      memberSettings.isSettingAutoSave &&
      settingsHaveChanged() &&
      memberSettings.companyName !== undefined
    ) {
      requestUpdate(
        {
          ...memberSettings,
        },
        false
      );
    }

    // 현재 상태를 이전 상태 참조에 저장
    prevSettingsRef.current = {
      companyName: companyNameInput,
      isCompanyChildren,
      companyChildrenList,
      companyLogoFile,
    };
  }, [
    companyNameInput,
    isCompanyChildren,
    companyChildrenList,
    companyLogoFile,
    memberSettings.isSettingAutoSave,
  ]);

  return (
    <Row gutter={8} className="w-full">
      <Form
        labelCol={{
          span: 8,
        }}
        style={{
          width: "100%",
        }}
        labelAlign="right"
        form={companyForm}
        layout="vertical"
      >
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Form.Item name="companyLogo" label="회사로고">
                <Upload
                  listType="picture-card"
                  fileList={companyLogoFile}
                  onRemove={handleCompanyLogoFileRemove}
                  customRequest={handleCompanyLogoUploadAdd}
                >
                  {companyLogoFile.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
              <Form.Item name="companyName" label="회사명">
                <Input
                  value={companyNameInput}
                  onChange={(e) => setCompanyNameInput(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="isCompanyChildren" label="자회사보유">
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
                              value={companyChildrenInput}
                              onChange={(e) =>
                                setCompanyChildrenInput(e.target.value)
                              }
                              onPressEnter={(e) =>
                                handleChildrenAdd(
                                  e.target.value,
                                  companyChildrenList,
                                  setCompanyChildrenList
                                )
                              }
                            />
                            <Button
                              onClick={() =>
                                handleChildrenAdd(
                                  companyForm.getFieldValue(
                                    "companyChildrenName"
                                  ),
                                  companyChildrenList,
                                  setCompanyChildrenList
                                )
                              }
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
                                    setCompanyChildrenList
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
              <div className="flex w-full justify-end">
                {memberSettings.isSettingAutoSave ? (
                  <span className="text-gray-400 font-semibold text-xs">
                    자동저장사용중
                  </span>
                ) : (
                  <Button
                    htmlType="submit"
                    size="large"
                    type="primary"
                    className="bg-blue-500 "
                    onClick={() =>
                      requestUpdate(
                        {
                          ...memberSettings,
                        },
                        true
                      )
                    }
                  >
                    저장
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Form>
    </Row>
  );
};

export default CompanySetting;
