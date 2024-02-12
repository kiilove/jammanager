import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFirestoreAddData, useFirestoreQuery } from "../hooks/useFirestore";
import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  notification,
} from "antd";
import { ContentTitle } from "../commonstyles/Title";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import "dayjs/locale/ko";
import locale from "antd/es/date-picker/locale/ko_KR";

const NewTransplanting = () => {
  const [projectDate, setProjuctDate] = useState(dayjs(new Date()));
  const [basicData, setBasicData] = useState({});
  const [descriptionData, setDescriptionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hookError, setHookError] = useState(null);

  const location = useLocation();
  const firebaseAdd = useFirestoreAddData();
  const firebaseQuery = useFirestoreQuery();

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (apiType, title, message, placement, duration) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
    });
  };
  const formRef = useRef();

  const projectArray = [];

  const fetchData = async () => {
    try {
      await firebaseQuery.getDocuments("basicdata", (data) => {
        setBasicData(data[0]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = (values) => {
    console.log(values);
    handleAddTransplanting(values);
  };

  const initFormValue = () => {
    formRef?.current?.setFieldsValue({
      ...formRef?.current.getFieldsValue(),
      transplantingDate: projectDate,
      transplantingBarCode: makeProjectId(projectDate),
    });
  };
  const makeProjectId = (propDate) => {
    const projectYear = propDate.year();
    const projectMonth = String(propDate.month() + 1).padStart(2, "0");
    const projectDay = String(propDate.date()).padStart(2, "0");
    const projectNumber = String(projectArray.length + 1).padStart(3, "0");
    const newProjuctId =
      projectYear + projectMonth + projectDay + projectNumber;
    return newProjuctId;
  };

  const handleAddTransplanting = async (values) => {
    const newValues = {
      ...values,
      sowing: location.state.prevData,
      transplantingDate: values.transplantingDate.toDate(),
      treeMemos: [],
    };
    try {
      await firebaseAdd.addData("transplanting", { ...newValues }, () => {
        openNotification("success", "추가", "저장되었습니다.", "top", 2);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBasicInfo = () => {
    if (location.state.prevData?.id) {
      const {
        id,
        isActive,
        seedSowing,
        seedSowingType,
        seedName,
        seedProjectName,
        seedPurchaseOfficeName,
        seedSowingDate,
        dayDiff,
      } = location.state.prevData;

      const timestamp = new Timestamp(
        seedSowingDate.seconds,
        seedSowingDate.nanoseconds
      );

      // toDate() 메서드를 사용하여 JavaScript Date 객체로 변환
      const date = timestamp.toDate();

      // dayjs를 사용하여 형식을 변경
      const newSeedDate = dayjs(date).format("YYYY-MM-DD");

      const newData = [
        {
          key: "1",
          label: "파종일",
          children: newSeedDate,
        },
        {
          key: "2",
          label: "파종",
          children: (
            <span>
              {seedSowing.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              <span>{seedSowingType === "weight" ? "kg" : "개"}</span>
            </span>
          ),
        },
        { key: "3", label: "종자명", children: seedName },
        { key: "4", label: "육종일수", children: dayDiff + "일" },
        { key: "5", label: "매입처", children: seedPurchaseOfficeName },
      ];

      setDescriptionData([...newData]);
    }
  };
  useEffect(() => {
    console.log(location);
    handleBasicInfo();
  }, [location]);

  useEffect(() => {
    if (descriptionData?.length > 0) {
      setIsLoading(false);
    }
  }, [descriptionData]);

  useEffect(() => {
    if (firebaseQuery.error !== null) {
      console.log(firebaseQuery.error);
    }
  }, [firebaseQuery.error]);

  useEffect(() => {
    console.log(basicData);
    initFormValue();
  }, [basicData]);

  useEffect(() => {
    initFormValue();
  }, [projectDate]);

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
        <div
          className="flex w-full h-full flex-col rounded-lg"
          style={{
            backgroundColor: "#fff",
            minHeight: "100%",
          }}
        >
          <div className="flex w-full ">
            <ContentTitle title="유묘이식" />
          </div>
          <div className="flex w-full flex-col px-4 gap-y-4">
            <Descriptions items={descriptionData} bordered />
            <div className="flex w-full">
              <Form
                layout="inline"
                style={{
                  width: "100%",
                }}
                labelAlign="right"
                ref={formRef}
                onFinish={onFinish}
              >
                <Form.Item
                  name="transplantingDate"
                  label="이식일자"
                  rules={[
                    { required: true, message: "이식일자를 선택해주세요" },
                  ]}
                >
                  <DatePicker
                    locale={locale}
                    defaultValue={dayjs(new Date())}
                    onChange={(e) => {
                      setProjuctDate(e);
                    }}
                  />
                </Form.Item>
                <Form.Item name="transplantingTreeCount" label="묘목수">
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: 150 }}
                    addonAfter="주"
                  />
                </Form.Item>
                <Form.Item label="이식장소" name="transplantingBlock">
                  <Select>
                    {basicData.blocks?.length > 0 &&
                      basicData.blocks.map((block, bIdx) => {
                        const { blockName, sections } = block;
                        return (
                          <Select.Option value={blockName}>
                            {blockName}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
                <Form.Item label="바코드넘버" name="transplantingBarCode">
                  <Input />
                  {/* <Button onClick={() => makeProjectId()}>자동생성</Button> */}
                </Form.Item>
                <Button htmlType="submit">저장</Button>
              </Form>
            </div>
          </div>
          {contextHolder}
        </div>
      )}
    </>
  );
};

export default NewTransplanting;
