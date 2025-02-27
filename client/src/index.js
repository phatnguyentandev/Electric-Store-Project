import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { monitorToken } from "./tokenManager"; // Import đúng

const root = ReactDOM.createRoot(document.getElementById("root"));

// Khởi động theo dõi token
monitorToken();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
