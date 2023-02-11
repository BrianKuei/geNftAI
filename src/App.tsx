import React, { useState, useEffect } from "react";
import "./App.css";
import "@twa-dev/sdk";

import FormComponent from "./partial/Form";
import Layout from "./component/Layout";
import Landing from "./partial/Landing";
import Confirm from "./partial/Confirm";
import Result from "./partial/Result";

export type Info = Partial<{
  description: string;
  imgUrl: string
  mintAmount: number
  projectName: string;
  resultLink: string
  term: boolean,
  jsonUrl: string
}>

function App() {
  const [steps, setSteps] = useState(0);
  const [projectInfo, setProjectInfo] = useState<Info>({
    resultLink: "https://www.google.com/",
    imgUrl: "https://reurl.cc/WDa5VZ",
  });

  const handleContentOnChange = ({ props, step }: any) => {
    setProjectInfo((prev) => ({ ...prev, ...props }));

    /** handle Confirm page on reset */
    if (props?.isBack) return setSteps((prev) => prev - 1);

    const lastStep = stepConfig.length - 1;
    if (step !== lastStep) setSteps(step + 1);
  };

  const handleOnBack = () => {
    if (!!steps) setSteps((prev) => prev - 1);
  };

  const stepConfig = [
    {
      key: "landing",
      title: "geNftAI",
      component: (
        <Landing
          onChange={(props) => handleContentOnChange({ props, step: 0 })}
        />
      ),
    },
    {
      key: "form",
      title: "Input Information",
      component: (
        <FormComponent
          onChange={(props) => handleContentOnChange({ props, step: 1 })}
        />
      ),
    },
    {
      key: "confirm",
      title: "Confirm",
      component: (
        <Confirm
          projectInfo={projectInfo}
          setProjectInfo={setProjectInfo}
          onChange={(props) => handleContentOnChange({ props, step: 2 })}
        />
      ),
    },
    {
      key: "result",
      title: "GENFTAPI",
      component: (
        <Result
          projectInfo={projectInfo}
          onChange={(props) => handleContentOnChange({ props, step: 3 })}
        />
      ),
    },
  ];

  const pageTitle = stepConfig[steps]?.title;
  const Element = stepConfig[steps]?.component || <></>;

  return (
    <>
      {!!steps ? (
        <Layout title={pageTitle} onBack={handleOnBack}>
          {Element}
        </Layout>
      ) : (
        <Layout title={pageTitle}>{Element}</Layout>
      )}
    </>
  );
}

export default App;
