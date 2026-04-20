import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { routerFuture } from "./routerFuture";
import { LeadFormRulesProvider } from "./features/configuration/LeadFormRulesContext";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter future={routerFuture}>
      <ThemeProvider>
        <LeadFormRulesProvider>
          <App />
        </LeadFormRulesProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
