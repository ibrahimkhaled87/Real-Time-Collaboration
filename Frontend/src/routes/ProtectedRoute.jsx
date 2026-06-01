import { RoomProvider } from "@liveblocks/react";
import { Navigate } from "react-router-dom";
import useTokenDecode from "../hooks/useTokenDecode";

export default function ProtectedRoute({children}) {
    const token = localStorage.getItem("token");
    const payload = useTokenDecode();

    return (!token) ? <Navigate to="/" /> : (!payload)? <p>Loading...</p> :
        <RoomProvider id="app-room" initialPresence={{online: payload.username}}>
            {children}
        </RoomProvider>       
}