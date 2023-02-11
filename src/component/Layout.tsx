import { Layout } from "antd";
import React from "react";
import PageHeader from "./PageHeader";

const LayoutComponent = ({ children }: { children: JSX.Element }) => {
  return (
    <Layout className="w-full h-screen">
      <PageHeader />
      <Layout.Content className="w-full h-full border p-4 relative">
        {children}
      </Layout.Content>
    </Layout>
  );
};

export default LayoutComponent;
