import React, { useState } from "react";
import { Checkbox, Form, Input, InputNumber } from "antd";
import ButtonComponent from "./Button";

const FormComponent = () => {
  const initialValues = { term: true, mintAmount: 1 };
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialValues);

  const onFinish = async (values: any) => {
    const { description } = values;
    setLoading(true);

    const { message, url } = await getImage({ description });
    if (url) setLoading(false);
    // TODO: set form data

    setTimeout(() => {
      setLoading(false);
      // TODO: show alert
    }, 15000);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    // TODO: show alert
  };

  const getImage = async (body: { description: string }) => {
    const API_URL = "https://genftai.glitch.me/api/generateimg";

    fetch(API_URL, {
      body: JSON.stringify(body),
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "user-agent": "Mozilla/4.0 MDN Example",
        "content-type": "application/json",
      },
      method: "POST",
      mode: "cors",
      redirect: "follow",
      referrer: "no-referrer",
    })
      .then((res) => res.json())
      .then((res) => {
        const { Message, url = "" } = res;

        return { message: Message, url };
      });

    return { message: "Error:(錯誤內容)", url: "" };
  };

  return (
    <Form
      layout="vertical"
      name="basic"
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Project Name"
        name="projectName"
        rules={[{ required: true, message: "Please input your Project Name!" }]}
      >
        <Input placeholder="Please input your Project Name" />
      </Form.Item>

      <Form.Item
        label="Mint Amount"
        name="mintAmount"
        rules={[{ required: true, message: "Please input your Mint Amount!" }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please input your Description!" }]}
      >
        <Input.TextArea placeholder="Please input your Description" />
      </Form.Item>

      <Form.Item
        name="term"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>
          I accept the following terms <a href="#">geNftAI user term</a>
        </Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <ButtonComponent
          text={"Gen My NFT!"}
          htmlType="submit"
          loading={loading}
          // disabled={loading}
        />
      </Form.Item>
    </Form>
  );
};

export default FormComponent;
