import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://osmanthustonx.github.io/geNftAI/tonconnect-manifest.json';


const router = createBrowserRouter([
  {
    path: "/geNftAI",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <RouterProvider router={router} />
    </TonConnectUIProvider>
  </React.StrictMode>
);
