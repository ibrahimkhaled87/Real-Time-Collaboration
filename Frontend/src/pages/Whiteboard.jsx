import { User2Icon, Eraser, Pen, StickyNote, TextCursorIcon, MousePointer, Undo, Redo, MessageSquareMoreIcon, Send } from "lucide-react";
import { RoomProvider, useUpdateMyPresence, useOthers, useEventListener } from "@liveblocks/react";
import useTokenDecode from "../hooks/useTokenDecode";
import { useState, useRef, useEffect } from "react";
import api from "../utils/axios";
import { useFetchTeamMessages } from "../hooks/useFetch";
import { useParams } from "react-router-dom";

function Room() {
    const payload = useTokenDecode();

    const [position, setPosition] = useState({x:0, y:0});

    // Read other cursors
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

    // Selected tool
    const [seletedTool, setSelectedTool] = useState("pen");

    // Canvas setup
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [color, setColor] = useState("black");
    const [width, setWidth] = useState(3);
    
    useEffect(() => {
        const canvas = canvasRef.current;

        const rect = canvas.getBoundingClientRect();

        // Set actual pixel resolution
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext("2d");

        // Drawing style
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.imageSmoothingEnabled = true;
        ctx.strokeStyle = color;
    }, []);

    useEffect(() => {
        if(seletedTool==="eraser") {
            setColor("#eee");
            setWidth(40);
        }
        else {
            setColor("black");
            setWidth(3); 
        }
    }, [seletedTool])

    useEffect(()=>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.lineWidth = width;
        ctx.strokeStyle = color;
    }, [color, width])

    
    // Canvas Draw
    const startDraw = (e) => {
        if(seletedTool!=="pen" && seletedTool!=="eraser") return;

        setDrawing(true);
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e) => {
        if (!drawing) return;
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };
    
    const stopDraw = () => {
        setDrawing(false);
    };

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


    //Canvas sticky
    const [stickyArr, setStickyArr] = useState([]);
    const onClick = (e) => {
        if(seletedTool!=="sticky") return;

        const newSticky = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            width: 160,
            height: 128,
            content: "new note"
        }
        setStickyArr(prev => [...prev, newSticky]);
    }
    const dragNote = (e, note) => {
        if (e.target !== e.currentTarget) return; //inner != outer
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        //Starting mouse pos
        const startX = e.clientX;
        const startY = e.clientY;
        //Starting note state
        const startWidth = note.width;
        const startHeight = note.height;
        const startLeft = rect.left;
        const startTop = rect.top;
        const startBottom = rect.bottom;
        const startRight = rect.right;

        //Drag
        if(offsetX > 3 && offsetY > 3) {
            console.log("DRAG");
            const move = (ev) => {
                setStickyArr(prev =>
                    prev.map(n =>
                        n.id === note.id
                            ? {
                                ...n,
                                x: ev.clientX - offsetX,
                                y: ev.clientY - offsetY
                            }
                            : n
                    )
                );
            };

            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", () => {
                window.removeEventListener("mousemove", move);
            }, { once: true });
        }
        
        //Resize
        else {
            console.log("RESIZE");
            const resize = (ev) => {
                const dx = ev.clientX - startX;
                const dy = ev.clientY - startY;
                console.log(startWidth + dx, startHeight + dy);

                setStickyArr(prev =>
                    prev.map(n =>
                        n.id === note.id
                            ? {
                                ...n,
                                height: startHeight + dy,
                                width: startWidth + dx
                            }
                            : n
                    )
                );
            }

            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", () => {
                window.removeEventListener("mousemove", resize);
            }, { once: true });
        }

    }


    return (
        <div className="app" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <canvas 
                ref={canvasRef} 
                onMouseDown={startDraw} 
                onMouseMove={draw} 
                onMouseUp={stopDraw}

                onClick={onClick}
            />

            {/* Flowing sticky */}
            {stickyArr.map(note => (
                <div 
                    className="sticky"
                    contentEditable
                    key={note.id}
                    onMouseDown={(e)=>dragNote(e, note)}
                    style={{
                        width: note.width,
                        height: note.height,
                        padding: "1em",
                        borderRadius: "0.3em",
                        backgroundColor: "yellow",
                        position: "absolute",
                        zIndex: "2",
                        left: note.x,
                        top: note.y,
                        cursor: "move"
                    }}
                >
                    {note.content}
                </div>
            ))}
            
            
            <div className="flowing context">
                <p>Team 1</p>
            </div>

            <div className="flowing presence">
                {others.map(({connectionId, presence}) => (
                    <div className="user">
                        <User2Icon />
                        <p className="name" >{presence.username}</p>
                    </div>
                ))}
            </div>

            <div className="flowing toolset">
                <Pen className={`tool ${seletedTool==="pen" && "selected"}`} onClick={()=>setSelectedTool("pen")}/>
                <Eraser className={`tool ${seletedTool==="eraser" && "selected"}`} onClick={()=>setSelectedTool("eraser")}/>
                <StickyNote className={`tool ${seletedTool==="sticky" && "selected"}`} onClick={()=>setSelectedTool("sticky")}/>
                <TextCursorIcon className={`tool ${seletedTool==="text" && "selected"}`} onClick={()=>setSelectedTool("text")}/>
                <MousePointer className={`tool ${seletedTool==="cursor" && "selected"}`} onClick={()=>setSelectedTool("cursor")}/>
            </div>

            <div className="flowing undo-redo">
                <Undo className="tool" />
                <Redo className="tool" />
            </div>

            <div 
                className="flowing tool"
                style={{
                    width: width,
                    height: width,
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    border: "1px solid gray",
                    position: "absolute",
                    left: position.x,
                    top: position.y,
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none"
                }}
            />

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

            {/* Flowing cursors */}
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
                        }}
                    >
                    {presence.username}
                    </div>
                );
            })}

        </div>
    );
}

export default function Whiteboard() {
    // Get board id
    const {boardId} = useParams();

    const payload = useTokenDecode();
    if(!payload) return;

    return (
        <RoomProvider id={`board:${boardId}`} initialPresence={{ 
            username: payload?.username,
            cursor: null 
        }}>
            <Room />
        </RoomProvider>
    );
}