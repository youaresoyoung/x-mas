import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import "./index.css";

import Entrance from "./pages/Entrance";
import Home from "./pages/Home";
import { Layout } from "./pages/Layout";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { AuthService } from "./service/authService";
import { ProtectedRoute } from "./route/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute requireAuth={true}>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/entrance",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Entrance />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Navigate to="/entrance" replace /> },
    ],
  },
]);

const authService = new AuthService();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider authService={authService}>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);
