import React, { useEffect, useState } from "react";
import { Checkbox, Form, Input, InputNumber } from "antd";
import msg from "antd/lib/message";
import ButtonComponent from "../component/Button";

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

    // const { message, url } = await getImage({ description });

    // if (!url) {
    //   setLoading(false);
    //   return msg.error({
    //     content: message,
    //     className: "custom-class",
    //     style: {
    //       marginTop: "80vh",
    //     },
    //   });
    // }

    onChange && onChange(values);
    setLoading(false);

    setTimeout(() => {
      setLoading(false);
      msg.error({
        content: "Error: System Error!",
        className: "custom-class",
        style: {
          marginTop: "80vh",
        },
      });
    }, 15000);
  };

  const onFinishFailed = (errorInfo: any) => {
    msg.warn({
      content: "Warn: Check your form and try again.",
      className: "custom-class",
      style: {
        marginTop: "80vh",
      },
    });
  };

  const getImage = async (body: { description: string }) => {
    const API_URL = "https://genftai.glitch.me/api/generateimg";

    try {
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
    } catch {
      (e: any) => console.error(e);
    }

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
      className="h-full"
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

      <Form.Item className="absolute bottom-0 m-0">
        <ButtonComponent
          text={"Gen My NFT!"}
          htmlType="submit"
          loading={loading}
          className="w-full"
          type="primary"
        />
      </Form.Item>
    </Form>
  );
};

export default FormComponent;
