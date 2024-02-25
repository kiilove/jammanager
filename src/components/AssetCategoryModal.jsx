import { Button, Col, Divider, Form, Input, Row, Select } from "antd";
import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { ContentTitle } from "../commonstyles/Title";
import { initDepreciationPeriod, initDepreciationType } from "../InitValues";

const AssetCategoryModal = ({ action, data, setData, setClose, index }) => {
  const [categoryForm] = Form.useForm();

  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1223px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  const handleFinished = (value) => {
    const newData = [...data];
    const newValue = { ...value };
    switch (action) {
      case "add":
        const newKey = data.length + 1;
        newValue.key = newKey;
        newValue.index = newKey;
        newValue.productLine = [];
        newData.push({ ...newValue });
        setData(() => [...newData]);
        setClose(() => ({ visible: false, component: null }));
        break;
      case "edit":
        newData.splice(index, 1, { ...newData[index], ...newValue });

        setData(() => [...newData]);
        setClose(() => ({ visible: false, component: null }));
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (action === "edit") {
      const assetCategory = { ...data[index] };
      categoryForm.setFieldsValue({
        name: assetCategory.name,
        depreciationType: assetCategory.depreciationType,
        depreciationPeriod: assetCategory.depreciationPeriod,
      });
    }
  }, [data, index]);

  return (
    <Row className={isMobile && "w-full"}>
      <Col span={24}>
        <ContentTitle
          title={action === "add" ? "분류추가" : "분류수정"}
          padding={0}
          marginBottom={5}
        />
        <Divider />
        <Form
          labelCol={{
            span: 4,
          }}
          style={{ width: "100%" }}
          form={categoryForm}
          onFinish={handleFinished}
        >
          <Form.Item label="분류명" name="name">
            <Input style={{ width: "90%" }} />
          </Form.Item>

          <Form.Item label="감가방식" name="depreciationType">
            <Select options={initDepreciationType} style={{ width: 180 }} />
          </Form.Item>
          <Form.Item label="감가기간(율)" name="depreciationPeriod">
            <Select options={initDepreciationPeriod} style={{ width: 180 }} />
          </Form.Item>
          <div className="flex w-full justify-end px-2">
            <Button htmlType="submit" type="primary" className="bg-blue-500">
              {action === "add" ? "추가" : "수정"}
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default AssetCategoryModal;
