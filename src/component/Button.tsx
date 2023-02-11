import React from "react";
import Button, { ButtonProps } from "antd/lib/button";

interface IButtonComponent extends ButtonProps {
  text?: string;
}

const ButtonComponent = ({
  text,
  htmlType = "submit",
  type,
  disabled = false,
  loading = false,
  className,
  onClick,
  ...res
}: IButtonComponent) => {
  return (
    <Button
      className={"p-4 bg-[#1890ff]" + className}
      loading={loading}
      disabled={disabled}
      type={type}
      htmlType={htmlType}
      onClick={onClick}
      {...res}
    >
      {text}
    </Button>
  );
};

export default ButtonComponent;
