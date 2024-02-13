import React, { useEffect, useState } from "react";
import { initDescription } from "../InitValues";
import { AutoComplete, Card, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

const AssetDescription = ({ propProductLine }) => {
  const [description, setDescription] = useState([]);
  const [form] = Form.useForm();

  const renderInput = (list) => {
    let component;
    if (list?.length > 0) {
      const inputs = list.map((input, iIdx) => {
        switch (input.valueType) {
          case "autoComplete":
            component = <AutoComplete />;
            break;
          case "textArea":
            component = <TextArea />;
            break;
          case "textSize":
            component = (
              <div className="flex gap-x-2 justify-start items-center">
                <Input maxLength={6} style={{ width: 70 }} />
                <span>×</span>
                <Input maxLength={6} style={{ width: 70 }} />
                <span>×</span>
                <Input maxLength={6} style={{ width: 70 }} />
                <Select
                  style={{ width: 70 }}
                  options={[
                    { value: "mm", label: "mm" },
                    { value: "cm", label: "cm" },
                    { value: "m", label: "m" },
                  ]}
                />
              </div>
            );
            break;
          default:
            break;
        }
        const field = <Form.Item label={input.keyName}>{component}</Form.Item>;
        return field;
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
        <Card title="스펙" style={{ width: "100%" }} className="rounded-md">
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
            form={form}
          >
            {description.length > 0 && renderInput(description)}
          </Form>
        </Card>
      )}
    </>
  );
};

export default AssetDescription;
