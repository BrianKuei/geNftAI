import { Layout } from "antd";
import React from "react";
import PageHeader from "./PageHeader";

interface ILayout {
  children: JSX.Element;
  onBack?(): void;
}

const LayoutComponent = ({ children, onBack }: ILayout) => {
  return (
    <Layout className="w-full h-screen">
      <PageHeader onBack={onBack} />
      <Layout.Content className="w-full h-full border p-4 relative">
        {children}
      </Layout.Content>
    </Layout>
  );
};

export default LayoutComponent;
