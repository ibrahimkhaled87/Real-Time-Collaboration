import { useEffect, useState } from "react";
import { User2Icon, MessageSquareMoreIcon, Send } from "lucide-react";
import { RoomProvider, useEventListener, useOthers, useUpdateMyPresence } from "@liveblocks/react";
import { useFetchTeamMessages } from "../../../hooks/useFetch";
import api from "../../../utils/axios";
import useTokenDecode from "../../../hooks/useTokenDecode";
import { useParams } from "react-router-dom";

function Room() {
    const {teamId} = useParams(); 
    const payload = useTokenDecode();

    const [show, setShow] = useState(false);
    const {messages, setMessages} = useFetchTeamMessages(teamId);
    
    const [newMessage, setNewMessage] = useState("");
    const sendMessage = async(e) => {
        e.preventDefault();

        await api.post(`/teams/${teamId}/messages`, {message:newMessage, sender:payload.username});
        setNewMessage("");
    }

    //Typing emit, listen
    const others = useOthers();
    const updateMyPresence = useUpdateMyPresence();
    useEffect(()=>{
        if(newMessage)
            updateMyPresence({
                username: payload?.username,
                typing: true
            })
        else
            updateMyPresence({
                typing: false
            })
    }, [newMessage])


    //Listen backend
    useEventListener(({ event }) => {
        switch (event.type) {
            case "new-message":
                setMessages(prev => [event.message, ...prev])
                break;
        }
    });

    
    return <>    
        <div className="flowing chat" onClick={()=>setShow(true)}>
            <MessageSquareMoreIcon />
        </div>

        <div className={`chat-panel ${show && "show"}`}>
            <div className="section top">
                <h2>Chat</h2>
                <h2 className="close" onClick={()=>setShow(false)}>&times;</h2>
            </div>
            <div className="section messages">
                {others.map(({connectionId, presence}) => (
                    presence.typing ? <p>...{presence.username} is typing</p> : null
                ))}
                {messages?.map(message => (
                    <div className={`area ${message.sender===payload.username && "mine"}`}>
                        {message.sender!==payload.username && <User2Icon />}
                        <div className="bubble">
                            <p>{message.message}</p>
                            <p className="time">{new Date(message.sent_at).toLocaleTimeString({hour:"2-digit", minute:"2-digit"})}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form className="section" onSubmit={sendMessage}>
                <input type="text" placeholder="Send message" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} />
                <Send color="white" className="send" />
            </form>
        </div>
    </>
}

export default function ChatPanel() {
    const {teamId} = useParams(); 

    return (
        <RoomProvider id={`team:${teamId}`}>
            <Room />
        </RoomProvider>
    )
}