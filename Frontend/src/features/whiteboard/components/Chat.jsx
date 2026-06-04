import { User2Icon, MessageSquareMoreIcon, Send } from "lucide-react";
import { useState } from "react";
import { useEventListener } from "@liveblocks/react";
import useTokenDecode from "../../../hooks/useTokenDecode";
import { useFetchTeamMessages } from "../../../hooks/useFetch";
import api from "../../../utils/axios";

export default function Chat() {
    const payload = useTokenDecode();

    //Chat panel
    const [show, setShow] = useState(false);

    //Fetch messages
    const {messages, setMessages} = useFetchTeamMessages();

    //Send new message
    const [newMessage, setNewMessage] = useState("");
    const sendMessage = async(e) => {
        e.preventDefault();

        await api.post(`/teams/${1}/messages`, {message:newMessage, sender:payload.username});
        setNewMessage("");
    }

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