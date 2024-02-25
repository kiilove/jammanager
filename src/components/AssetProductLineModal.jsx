import { Button, Col, Divider, Form, Input, Row, Select } from "antd";
import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { ContentTitle } from "../commonstyles/Title";
import { initDepreciationPeriod, initDepreciationType } from "../InitValues";

const AssetProductLineModal = ({
  action,
  data,
  setData,
  setClose,
  index,
  parentIndex,
}) => {
  const [productForm] = Form.useForm();

  const handleFinished = (value) => {
    const parentData = [...data];
    const newData = { ...data[parentIndex] };
    const newValue = { ...value };
    switch (action) {
      case "add":
        const newKey = `${parentIndex}-${data.length + 1}`;
        newValue.key = newKey;
        newValue.index = data.length + 1;

        newData.productLine.push({ ...newValue });
        parentData.splice(parentIndex, 1, newData);
        console.log(parentData);
        setData(() => [...parentData]);
        setClose(() => ({ visible: false, component: null }));
        break;
      case "edit":
        // newData.splice(index, 1, { ...newData[index], ...newValue });

        // setData(() => [...newData]);
        // setClose(() => ({ visible: false, component: null }));
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (action === "edit") {
      const assetCategory = { ...data[index] };
      productForm.setFieldsValue({
        name: assetCategory.name,
        depreciationType: assetCategory.depreciationType,
        depreciationPeriod: assetCategory.depreciationPeriod,
      });
    }
  }, [data, index]);
  return (
    <Row className={"w-full"}>
      <Col span={24}>
        <ContentTitle
          title={action === "add" ? "품목추가" : "품목수정"}
          padding={0}
          marginBottom={5}
        />
        <Divider />
        <Form
          labelCol={{
            span: 4,
          }}
          style={{ width: "100%" }}
          form={productForm}
          onFinish={handleFinished}
        >
          <Form.Item label="품목명" name="name">
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

export default AssetProductLineModal;
