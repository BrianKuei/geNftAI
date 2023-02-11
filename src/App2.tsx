import React, { useState, useEffect } from "react";
import "./App.css";
import "@twa-dev/sdk";

import FormComponent from "./partial/Form";
import Layout from "./component/Layout";
import Landing from "./partial/Landing";
import Confirm from "./partial/Confirm";
import Result from "./partial/Result";

function App() {
  const [steps, setSteps] = useState(0);

  const handleContentOnChange = ({ props, step }: any) => {
    console.log("props", props);
    const lastStep = stepConfig.length - 1;

    if (step !== lastStep) setSteps(step + 1);
  };

  const handleOnBack = () => {
    if (!!steps) setSteps((prev) => prev - 1);
  };

  const stepConfig = [
    {
      key: "landing",
      component: (
        <Landing
          onChange={(props) => handleContentOnChange({ props, step: 0 })}
        />
      ),
    },
    {
      key: "form",
      component: (
        <FormComponent
          onChange={(props) => handleContentOnChange({ props, step: 1 })}
        />
      ),
    },
    {
      key: "confirm",
      component: (
        <Confirm
          onChange={(props) => handleContentOnChange({ props, step: 2 })}
        />
      ),
    },
    {
      key: "result",
      component: (
        <Result
          onChange={(props) => handleContentOnChange({ props, step: 3 })}
        />
      ),
    },
  ];

  const Element = stepConfig[steps]?.component || <></>;

  return <Layout onBack={handleOnBack}>{Element}</Layout>;
}

export default App;
