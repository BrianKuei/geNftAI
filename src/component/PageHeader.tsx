import React from "react";
import { PageHeader } from "antd";

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
      // TODO: close icon
      extra={<div onClick={handleOnClose}>X</div>}
    ></PageHeader>
  );
};

export default PageHeaderComponent;
