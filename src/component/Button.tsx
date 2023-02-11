import React from "react";
import { Button } from "antd";

interface IButtonComponent {
  text?: string;
  htmlType?: "submit" | "button" | "reset" | undefined;
  disabled?: boolean;
  loading?: boolean;
  onClick?(): void;
}

const ButtonComponent = ({
  text,
  htmlType = "submit",
  disabled = false,
  loading = false,
  onClick,
}: IButtonComponent) => {
  return (
    <Button
      loading={loading}
      disabled={disabled}
      type="primary"
      htmlType={htmlType}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default ButtonComponent;
