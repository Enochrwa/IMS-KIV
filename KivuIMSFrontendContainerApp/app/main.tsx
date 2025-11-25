import React from "react";
import ReactDOM from "react-dom/client";
import Routers from "./Routers";
import AppProviders from "./AppProviders";
import "./i18n/i18n";

import "./app.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <Routers />
  </AppProviders>
);
