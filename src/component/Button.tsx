import React from "react";
import { Button } from "antd";

interface IButtonComponent {
  text?: string;
  htmlType?: "submit" | "button" | "reset" | undefined;
  disabled?: boolean;
  type?:
    | "text"
    | "link"
    | "ghost"
    | "default"
    | "primary"
    | "dashed"
    | undefined;
  loading?: boolean;
  className?: string;
  onClick?(): void;
}

const ButtonComponent = ({
  text,
  htmlType = "submit",
  type,
  disabled = false,
  loading = false,
  className,
  onClick,
}: IButtonComponent) => {
  return (
    <Button
      className={"p-4 bg-[#1890ff]" + className}
      loading={loading}
      disabled={disabled}
      type={type}
      htmlType={htmlType}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default ButtonComponent;
