import React from "react";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import AppLayout from "./layout/AppLayout.jsx";
import AnalyzerPage from "./pages/AnalyzerPage.jsx";
import DemoGuidePage from "./pages/DemoGuidePage.jsx";
import HomePage from "./pages/HomePage.jsx";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/analyze", element: <AnalyzerPage /> },
      { path: "/demo", element: <DemoGuidePage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
