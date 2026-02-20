import { createRoot } from "react-dom/client";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import EditDebit from "./pages/EditDebit.jsx";
import DebitDetails from "./pages/DebitDetails.jsx";
import MonthlyPurchases from "./pages/MonthlyPurchases.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/edit",
    element: (
      <ProtectedRoute>
        <EditDebit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/details",
    element: (
      <ProtectedRoute>
        <DebitDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/monthly",
    element: (
      <ProtectedRoute>
        <MonthlyPurchases />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
