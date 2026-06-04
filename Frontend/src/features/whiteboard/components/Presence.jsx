import { User2Icon } from "lucide-react";
import { useOthers } from "@liveblocks/react"

export default function Presence() {
    const others = useOthers();

    return <>
        <div className="flowing presence">
            {others.map(({connectionId, presence}) => (
                <div className="user">
                    <User2Icon />
                    <p className="name" >{presence.username}</p>
                </div>
            ))}
        </div>

        {others.map(({ connectionId, presence }) => {
            if (!presence?.cursor) return null;

            return (
                <div
                    key={connectionId}
                    style={{
                        position: "absolute",
                        width: 10,
                        height: 10,
                        backgroundColor: "red",
                        borderRadius: "50%",
                        top: presence.cursor.y,
                        left: presence.cursor.x,
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        zIndex: "5"
                    }}
                >
                {presence.username}
                </div>
            );
        })}
    </>
}