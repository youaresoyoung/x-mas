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
import Socket from "./network/socket";

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

const SOCKET_URL = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_SERVER_URL
  : import.meta.env.VITE_SERVER_URL;

const socketClient = new Socket(SOCKET_URL);
const authService = new AuthService();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider authService={authService}>
      <SocketProvider socketClient={socketClient}>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);
