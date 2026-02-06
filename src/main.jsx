import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import EditDebit from "./pages/EditDebit.jsx";
import DebitDetails from "./pages/DebitDetails.jsx";
import MonthlyPurchases from "./pages/MonthlyPurchases.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/edit",
    element: <EditDebit />,
  },
  {
    path: "/details",
    element: <DebitDetails />,
  },
  {
    path: "/monthly",
    element: <MonthlyPurchases />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
