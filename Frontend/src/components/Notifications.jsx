import { Bell, MailPlus, Hand, Check, X } from "lucide-react";
import useTokenDecode from "../hooks/useTokenDecode";
import { useFetchNotifications } from "../hooks/useFetch";
import { useEventListener, RoomProvider } from "@liveblocks/react";
import { useState } from "react";
import api from "../utils/axios";
import { useTeams } from "../context/TeamsContext";

export function Room() {
    const payload = useTokenDecode();

    const {notifications, setNotifications} = useFetchNotifications(payload?.username);

    //listen
    const {setTeams} = useTeams();
    useEventListener(({event}) => {
        switch(event.type) {
            case "notification":
                setNotifications(prev => [...prev, event.notification]);
                break;
            case "new-team":
                console.log(event.team);
                setTeams(prev => [...prev, event.team]);
                break;
        }
    })

    const [show, setShow] = useState(false);

    const acceptInvite = async(e, notification) => {
        e.stopPropagation();
        await api.patch(`/users/${payload.username}/notifications`, {notification: notification, action: "accept"});
        setNotifications(prev => prev.map(el => ({...el, action: el.id===notification? "accept" : null})));
    }

    const declineInvite = async(e, notification) => {
        e.stopPropagation();
        await api.patch(`/users/${payload.username}/notifications`, {notification: notification, action: "decline"});
        setNotifications(prev => prev.map(el => ({...el, action: el.id===notification? "decline" : null})));
    }

    return <div className="notifications" onClick={()=>setShow(!show)}>
        <p className="count">{notifications?.length}</p>
        <Bell />
        <div className={`dropdown ${show && "show"}`}>
            <h3>Notifications</h3>
            {notifications?.map(notification => (
                <div className="notification">
                    {notification.type==="invitation" ? <Hand className="icon" /> : <MailPlus className="icon" />}
                    <div className="detail">
                        <p>{notification.notification}</p>
                        <p className="time">{new Date(notification.received_at).toLocaleString()}</p>
                    </div>
                    {notification.action ? null : notification.type==="invitation" &&
                    <div className="action">
                        <X color="red" cursor="pointer" onClick={(e)=>declineInvite(e, notification.id)}/>
                        <Check color="green" cursor="pointer" onClick={(e)=>acceptInvite(e, notification.id)} />
                    </div>
                    }
                </div>
            ))}
            <p className="all">View All &rarr;</p>
        </div>
    </div>
}

export default function Notifications() {
    const payload = useTokenDecode();
    if(!payload) return;

    return (
        <RoomProvider id={`user:${payload.username}`} initialPresence={{}}>
            <Room />
        </RoomProvider>
    );
}