import React, { useState, useEffect } from "react";
import "./App.css";
import "@twa-dev/sdk";
import { Steps } from "antd";

import FormComponent from "./component/Form";
import Layout from "./component/Layout";

interface IStepContent {
  step: number;
  component: JSX.Element;
}

function App() {
  // TODO: step
  const handleContentOnChange = (props: any) => {
    console.log("props", props);
  };

  return (
    <Layout>
      <FormComponent onChange={handleContentOnChange} />
    </Layout>
  );
}

export default App;
