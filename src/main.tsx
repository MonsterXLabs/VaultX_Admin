import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ThirdwebProvider } from "thirdweb/react";
import "./index.css";
import "./init";
import { ThemeProvider } from "./components/theme-provider";

const setTab = (tabName: string) => { console.log(tabName) }
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ThirdwebProvider>
        <App />
      </ThirdwebProvider>
    </ThemeProvider>
  </React.StrictMode>
);
