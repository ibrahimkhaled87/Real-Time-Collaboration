import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LiveblocksProvider } from "@liveblocks/react";
// JSX
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Whiteboard from "./features/whiteboard/Whiteboard";
import Layout from "./pages/Layout";
import { TeamsProvider } from "./context/TeamsContext";

const router = createBrowserRouter([
    {
        path: "",
        element: 
        <PublicOnlyRoute>
            <Login />
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
        path: "/board/:boardId",
        element: 
        <ProtectedRoute>
            <Whiteboard />
        </ProtectedRoute>
    }
])


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <LiveblocksProvider publicApiKey={process.env.REACT_APP_LIVEBLOCKS_PUBLIC_API_KEY} >
            <TeamsProvider>
                <RouterProvider router={router} />
            </TeamsProvider>
        </LiveblocksProvider>
    </React.StrictMode>
);