import { Layout } from "antd";
import React from "react";
import PageHeader from "./PageHeader";

const { Header, Footer, Sider, Content } = Layout;

const LayoutComponent = ({ children }: { children: JSX.Element }) => {
  return (
    <Layout>
      <PageHeader />
      <Content className="h-full border">{children}</Content>
    </Layout>
  );
};

export default LayoutComponent;
