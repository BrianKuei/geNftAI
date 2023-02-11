import React from "react";
import { PageHeader } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface IPageHeader {
  title?: string;
  onClose?(): void;
  onBack?(): void;
}
const PageHeaderComponent = ({
  title = "geNftAI",
  onClose,
  onBack,
}: IPageHeader) => {
  const handleOnBack = () => {
    onBack && onBack();
  };

  const handleOnClose = () => {
    onClose && onClose();
  };

  return (
    <PageHeader
      ghost={false}
      onBack={handleOnBack}
      title={title}
      extra={<CloseOutlined onClick={handleOnClose} />}
    ></PageHeader>
  );
};

export default PageHeaderComponent;
