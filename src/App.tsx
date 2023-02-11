import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import "@twa-dev/sdk";

import PageHeader from "./component/PageHeader";
import FormComponent from "./component/Form";
import Layout from "./component/Layout";

function App() {
  return (
    <div className="w-full bg-[#f3f3f3] h-screen border">
      <Layout>
        <FormComponent />
      </Layout>
      {/* <PageHeader /> */}

      {/* <TonConnectButton /> */}
    </div>
  );
}

export default App;
