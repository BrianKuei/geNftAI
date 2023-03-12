import React from "react";
import { PageHeader } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface IPageHeader {
  title?: string;
  onBack?(): void;
}
const PageHeaderComponent = ({ title = "genftai", onBack }: IPageHeader) => {
  const isBack = !!onBack;
  const handleOnBack = () => {
    onBack && onBack();
  };

  return (
    <>
      {isBack ? (
        <PageHeader ghost={false} onBack={handleOnBack} title={title} />
      ) : (
        <PageHeader ghost={false} title={title} />
      )}
    </>
  );
};

export default PageHeaderComponent;
