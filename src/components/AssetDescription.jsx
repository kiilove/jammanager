import React, { useEffect, useState } from "react";
import { initDescription } from "../InitValues";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import {
  AutoComplete,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { compact } from "lodash";

const AssetDescription = ({ propProductLine }) => {
  const [description, setDescription] = useState([]);
  const [descritionForm] = Form.useForm();

  const handleAddItem = (items) => {
    let lastKey = 1;
    const newItems = [...items];
    if (newItems.length > 0) {
      lastKey = newItems[newItems.length - 1].key + 2;
    }

    const newItem = { key: lastKey, keyName: "", valueType: "custom" };
    newItems.push({ ...newItem });
    console.log(newItems);
    setDescription(() => [...newItems]);
  };

  const handleCustomItem = () => {};
  const handleRemoveItem = (key) => {
    const newItems = description.filter((f) => f.key !== key);
    setDescription(() => [...newItems]);
  };

  const renderInput = (list) => {
    const items = [...list];

    let component;
    if (items?.length > 0) {
      const inputs = items.map((input, iIdx) => {
        switch (input.valueType) {
          case "autoComplete":
            component = (
              <Form.Item label={input.keyName}>
                <Space.Compact className="w-full">
                  <Form.Item name={input.keyName} noStyle>
                    <AutoComplete placeholder="내용" />
                  </Form.Item>
                  {input.isCount && (
                    <Form.Item name={`${input.keyName}_count`} noStyle>
                      <InputNumber placeholder="수량" />
                    </Form.Item>
                  )}
                  <Button
                    onClick={() => handleRemoveItem(input.key)}
                    icon={<FaMinusCircle className="text-red-500" />}
                  />
                </Space.Compact>
              </Form.Item>
            );
            break;
          case "textArea":
            component = (
              <Form.Item label={input.keyName}>
                <Space.Compact className="w-full">
                  <Form.Item name={input.keyName} noStyle>
                    <TextArea />
                  </Form.Item>
                  <Button
                    onClick={() => handleRemoveItem(input.key)}
                    icon={<FaMinusCircle className="text-red-500" />}
                  />
                </Space.Compact>
              </Form.Item>
            );
            break;
          case "textSize":
            component = (
              <Form.Item label={input.keyName}>
                <Space className="flex gap-x-2 justify-start items-center">
                  <Form.Item name="assetSizeWidth" noStyle>
                    <Input maxLength={6} style={{ width: 70 }} />
                  </Form.Item>
                  <span>×</span>
                  <Form.Item name="assetSizeWidth" noStyle>
                    <Input maxLength={6} style={{ width: 70 }} />
                  </Form.Item>
                  <span>×</span>
                  <Form.Item name="assetSizeWidth" noStyle>
                    <Input maxLength={6} style={{ width: 70 }} />
                  </Form.Item>
                  <Form.Item name="assetUnit" noStyle>
                    <Select
                      style={{ width: 70 }}
                      options={[
                        { value: "mm", label: "mm" },
                        { value: "cm", label: "cm" },
                        { value: "m", label: "m" },
                      ]}
                    />
                  </Form.Item>
                  <Button
                    onClick={() => handleRemoveItem(input.key)}
                    icon={<FaMinusCircle className="text-red-500" />}
                  />
                </Space>
              </Form.Item>
            );

            break;
          case "custom":
            component = (
              <Space className="flex justify-start items-start w-full flex-col md:flex-row">
                <Form.Item name="customKeyName">
                  <Input
                    placeholder="항목명"
                    className="w-full md:w-28 lg:w-36"
                  />
                </Form.Item>
                <Form.Item name="customKeyValue">
                  <Input placeholder="항목내용" className="w-full" />
                </Form.Item>
                <Form.Item name="customKeyValueCount">
                  <InputNumber placeholder="수량" className="w-full" />
                </Form.Item>
                <Button
                  onClick={() => handleRemoveItem(input.key)}
                  icon={<FaMinusCircle className="text-red-500" />}
                />
              </Space>
            );
            break;
          default:
            break;
        }

        return component;
      });
      return inputs;
    }
  };

  useEffect(() => {
    if (propProductLine) {
      const descriptionItems = initDescription.find(
        (f) => f.productLine === propProductLine
      )?.descritpionItem;

      if (descriptionItems) {
        setDescription(() => [
          ...initDescription.find((f) => f.productLine === propProductLine)
            ?.descritpionItem,
        ]);
      } else {
        setDescription([]);
      }
    }
  }, [propProductLine]);

  return (
    <>
      {description.length > 0 && (
        <Card
          title="스펙"
          style={{ width: "100%" }}
          className="rounded-md"
          extra={[
            <Button onClick={() => handleAddItem(description)}>
              항목추가
            </Button>,
          ]}
        >
          <Form
            labelWrap
            labelCol={{
              span: 5,
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
            labelAlign="right"
            form={descritionForm}
          >
            {description.length > 0 && renderInput(description)}
          </Form>
        </Card>
      )}
    </>
  );
};

export default AssetDescription;
