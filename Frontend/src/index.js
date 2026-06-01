import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LiveblocksProvider } from "@liveblocks/react";
// JSX
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Whiteboard from "./pages/Whiteboard";
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
        <LiveblocksProvider publicApiKey="pk_dev_p3H3BC3tUJpWnyS4QkieiyocibtEoXBqo4Ui8w-bOMtMAOWE5zRV967KjFI8T3Vn" >
            <TeamsProvider>
                <RouterProvider router={router} />
            </TeamsProvider>
        </LiveblocksProvider>
    </React.StrictMode>
);