import React from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Instructions from "./routes/Instructions";
import Faq from "./routes/Faq";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path:'/instructions',
    element: <Instructions/>
  },
  {
    path:'/faq',
    element: <Faq/>
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
