import React, { useState } from "react";
import { Checkbox, Form, Input, InputNumber } from "antd";
import ButtonComponent from "../component/Button";
import toast from "../utils/toast";

interface IFFormComponent {
  onChange?(props: IFormData): void;
}

interface IFormData {
  projectName?: string;
  mintAmount: number;
  imgUrl?: string;
  term: boolean;
}

const FormComponent = ({ onChange }: IFFormComponent) => {
  const initialValues = { term: true, mintAmount: 1 };
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    const { description } = values;
    setLoading(true);

    const data = await getImage({ description });
    if (!data?.imgUrl) {
      setLoading(false);
      return toast.error(data?.message);
    }

    onChange && onChange({ ...values, imgUrl: data?.imgUrl });
    setLoading(false);

    setTimeout(() => {
      setLoading(false);
    }, 15000);
  };

  const onFinishFailed = (errorInfo: any) => {
    toast.warn();
  };

  const getImage = async (body: { description: string }) => {
    const API_URL = "https://genftai.glitch.me/api/generateimg";
    let result = {message: "", imgUrl: ""};

    await fetch(API_URL, {
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
        const { Message, url } = res;

        result.message = Message;
        result.imgUrl = url;
      })
      .catch((e: any) => console.error(e));

    return result;
  };

  return (
    <Form
      layout="vertical"
      name="basic"
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="w-full h-full flex flex-col"
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
        rules={[{ required: true, message: "Please check the user term!" }]}
      >
        <Checkbox>
          I accept the following terms <a href="#">geNftAI user term</a>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <ButtonComponent
          text={"Gen My NFT"}
          htmlType="submit"
          loading={loading}
          style={{ backgroundColor: "#1890ff", color: "#ffffff",width: "100%"}}
        />
      </Form.Item>
    </Form>
  );
};

export default FormComponent;
