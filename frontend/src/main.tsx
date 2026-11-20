import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { MotionConfig } from "framer-motion";
import { AppRoutes } from "@/routes";
import { SiteProvider } from "@/hooks/useSite";
import "@/styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <SiteProvider><AppRoutes /></SiteProvider>
        </BrowserRouter>
      </MotionConfig>
    </HelmetProvider>
  </React.StrictMode>
);
