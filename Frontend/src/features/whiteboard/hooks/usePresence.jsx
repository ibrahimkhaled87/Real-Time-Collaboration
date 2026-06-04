import { useOthers, useUpdateMyPresence } from "@liveblocks/react";
import useTokenDecode from "../../../hooks/useTokenDecode";

export default function usePresence({setPosition}) {
    const payload = useTokenDecode();

    const others = useOthers();
    const updateMyPresence = useUpdateMyPresence();

    const handleMouseMove = (e) => {
        setPosition({x:e.clientX, y:e.clientY});
        updateMyPresence({
            username: payload?.username,
            cursor: {
                x: e.clientX,
                y: e.clientY,
            },
        });
    };

    const handleMouseLeave = () => {
        updateMyPresence({ 
            username: payload?.username,
            cursor: null 
        });
    };


    return {others, handleMouseMove, handleMouseLeave};
}