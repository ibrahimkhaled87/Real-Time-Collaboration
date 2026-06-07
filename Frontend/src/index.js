import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LiveblocksProvider } from "@liveblocks/react";
// JSX
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Whiteboard from "./features/whiteboard/Whiteboard";
import Layout from "./pages/Layout";
import { TeamsProvider } from "./context/TeamsContext";
import api from "./utils/axios";

const router = createBrowserRouter([
    {
        path: "",
        element: 
        <PublicOnlyRoute>
            <Login />
        </PublicOnlyRoute>
    },
    {
        path: "/signup",
        element: 
        <PublicOnlyRoute>
            <Signup />
        </PublicOnlyRoute>
    },
    {
        path: "/app",
        element: 
        <ProtectedRoute>
            <Layout />
        </ProtectedRoute>
    },
    {
        path: "team/:teamId/board/:boardId",
        element: 
        <ProtectedRoute>
            <Whiteboard />
        </ProtectedRoute>
    }
])


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <LiveblocksProvider authEndpoint={async(room) => {
            const response = await api.post("/api/liveblocks-auth", room? {room} : {})
            return response.data;
        }} >
            <TeamsProvider>
                <RouterProvider router={router} />
            </TeamsProvider>
        </LiveblocksProvider>
    </React.StrictMode>
);