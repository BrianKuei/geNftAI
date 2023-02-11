import { Layout } from "antd";
import React from "react";
import PageHeader from "./PageHeader";

interface ILayout {
  title?: string;
  children: JSX.Element;
  onBack?(): void;
}

const LayoutComponent = ({ title, children, onBack }: ILayout) => {
  return (
    <Layout className="w-full h-screen">
      <PageHeader title={title} onBack={onBack} />
      <Layout.Content className="w-full h-full border p-4 relative">
        {children}
      </Layout.Content>
    </Layout>
  );
};

export default LayoutComponent;
