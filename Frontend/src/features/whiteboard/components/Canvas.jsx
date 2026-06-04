import { useState, useEffect, useRef } from "react";
import { useEventListener, useBroadcastEvent } from "@liveblocks/react";
import useTokenDecode from "../../../hooks/useTokenDecode";
import LayerSettings from "../../../components/LayerSettings";

export default function Canvas({selectedTool, position}) {
    const broadcast = useBroadcastEvent();
    const onMouseDown = (e) => {
        if(selectedTool==="pen" || selectedTool==="eraser")
            draw(e);
        else
            putSelectionNet(e);
    }


    // ===========
    // Canvas
    // ===========
    const canvasRef = useRef(null);
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
        if(selectedTool==="eraser") {
            setColor("#eee");
            setWidth(40);
        }
        else {
            setColor("black");
            setWidth(3); 
        }
    }, [selectedTool])

    useEffect(()=>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.lineWidth = width;
        ctx.strokeStyle = color;
    }, [color, width])

    //Canvas draw
    const draw = (e) => {
        const ctx = canvasRef.current.getContext("2d");
        const startX = e.nativeEvent.offsetX;
        const startY = e.nativeEvent.offsetY
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        broadcast({
            type: "start-draw",
            x: startX,
            y: startY,
            width,
            color
        });

        const move = (ev) => {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = ev.clientX - rect.left;
            const y = ev.clientY - rect.top;

            ctx.lineTo(
                x,
                y
            );
            ctx.stroke();

            broadcast({
                type: "draw",
                x,
                y
            });
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", () => {
            broadcast("stop-draw");
            window.removeEventListener("mousemove", move);
        })
    };


    // ================
    // Selection net
    // ================
    const [selectionNet, setSelectionNet] = useState({
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        visible: false
    })

    const putSelectionNet = (e) => {
        setSelctedId(null);
        const startX = e.clientX;
        const startY = e.clientY;
        setSelectionNet(prev => ({...prev, x:startX, y:startY, visible: true}));

        const move = (ev) => {
            const currentX = ev.clientX;
            const currentY = ev.clientY;

            setSelectionNet({
                x: Math.min(startX, currentX),
                y: Math.min(startY, currentY),
                width: Math.abs(currentX - startX),
                height: Math.abs(currentY - startY),
                visible: true
            });
        }

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", () => {
            setSelectionNet(prev => ({x:0, y:0, height:0, width:0, visible: false}))
            window.removeEventListener("mousemove", move);
        }, { once: true });
    }
    

    // ========
    // Sticky
    // ========
    const [stickyArr, setStickyArr] = useState([]);
    const addNote = (e) => {
        if(selectedTool!=="sticky") return;

        const newSticky = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            width: 160,
            height: 128,
            color: "yellow",
            content: "New note"
        }
        setStickyArr(prev => [...prev, newSticky]);

        broadcast({
            type: "new-note",
            note: newSticky
        });
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
        //Decide boundary click
        const edgeLeft = Math.abs(startX-startLeft)<=5;
        const edgeRight = Math.abs(startX-startRight)<=5;
        const edgeTop = Math.abs(startY-startTop)<=5;
        const edgeBottom = Math.abs(startY-startBottom)<=5;
        const cornerTopRight = edgeTop && edgeRight;
        const cornerTopLeft = edgeTop && edgeLeft;
        const cornerBottomRight = edgeBottom && edgeRight;
        const cornerBottomLeft = edgeBottom && edgeLeft;

        //Drag
        if(!edgeLeft && !edgeRight && !edgeTop && !edgeBottom) {
            console.log("DRAG");
            const move = (ev) => {
                const updatedNote = {
                    ...note,
                    x: ev.clientX - offsetX,
                    y: ev.clientY - offsetY
                };

                setStickyArr(prev =>
                    prev.map(n => n.id === note.id ? updatedNote : n)
                );

                broadcast({
                    type: "note-update",
                    note: updatedNote
                });
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

                let updates = {};

                if (cornerTopRight) {
                    updates = {
                        width: startWidth + dx,
                        height: startHeight - dy,
                        y: note.y + dy
                    };
                }
                else if (cornerTopLeft) {
                    updates = {
                        width: startWidth - dx,
                        x: note.x + dx,
                        height: startHeight - dy,
                        y: note.y + dy
                    };
                }
                else if (cornerBottomRight) {
                    updates = {
                        width: startWidth + dx,
                        height: startHeight + dy
                    };
                }
                else if (cornerBottomLeft) {
                    updates = {
                        width: startWidth - dx,
                        x: note.x + dx,
                        height: startHeight + dy
                    };
                }

                else if (edgeRight) {
                    updates = {
                        width: startWidth + dx
                    };
                }
                else if (edgeLeft) {
                    updates = {
                        width: startWidth - dx,
                        x: note.x + dx
                    };
                }
                else if (edgeBottom) {
                    updates = {
                        height: startHeight + dy
                    };
                }
                else if (edgeTop) {
                    updates = {
                        height: startHeight - dy,
                        y: note.y + dy
                    };
                }


                const updatedNote = {
                    ...note,
                    ...updates
                };

                setStickyArr(prev =>
                    prev.map(n =>
                        n.id === note.id
                            ? updatedNote
                            : n
                    )
                );
                
                broadcast({
                    type: "note-update",
                    note: updatedNote
                })
            };

            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", () => {
                window.removeEventListener("mousemove", resize);
            }, { once: true });
        }
    }

    const [cursor, setCursor] = useState("move");
    const stickyMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const edge = 5;

        const left = x <= edge;
        const right = x >= rect.width - edge;
        const top = y <= edge;
        const bottom = y >= rect.height - edge;

        if ((left && top) || (right && bottom))
            setCursor("nwse-resize");
        else if ((right && top) || (left && bottom))
            setCursor("nesw-resize");
        else if (left || right)
            setCursor("ew-resize");
        else if (top || bottom)
            setCursor("ns-resize");
        else
            setCursor("move");
    }

    const stickyInput = (e, note) => {
        const updatedContent = e.currentTarget.innerText;
        const updatedNote = {...note, content: updatedContent};   
    
        setStickyArr(prev =>
            prev.map(n =>
                n.id === note.id ? updatedNote : n
            )
        );

        broadcast({
            type: "note-update",
            note: updatedNote
        })
    }

    const [selectedId, setSelctedId] = useState(null);
    const updateSelectedId = (id) => {
        if(selectedTool!=="cursor") return;
            setSelctedId(id);
    }
    useEffect(() => {
        if(selectedTool!=="cursor")
            setSelctedId(null);
    }, [selectedTool])


    //Listen
    useEventListener(({ event }) => {
        const ctx = canvasRef.current.getContext("2d");
        switch (event.type) {
            case "start-draw":
                ctx.strokeStyle = event.color;
                ctx.lineWidth = event.width;
                ctx.beginPath();
                ctx.moveTo(event.x, event.y);
                break;
            case "draw":
                ctx.lineTo(event.x, event.y);
                ctx.stroke();
                break;
            case "stop-draw":
                ctx.closePath();
                break;
            case "new-note":
                setStickyArr(prev => [...prev, event.note])
                break;
            case "note-update":
                setStickyArr(prev => prev.map(n => n.id===event.note.id ? event.note : n))
                break;
            case "note-bring": {
                if(event.position==="front")
                    setStickyArr(prev => [...prev.filter(el=>el.id!==event.note.id), event.note])
                else if(event.position==="back")
                    setStickyArr(prev => [event.note, ...prev.filter(el=>el.id!==event.note.id)])
                else
                    setStickyArr(prev => [...prev.filter(el=>el.id!==event.note.id)])
            }
        }
    });

    return <>
        <div 
            className="selectionNet"
            style={{
                position: "absolute",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                border: "1px solid blue",
                left: selectionNet.x,
                top: selectionNet.y,
                width: selectionNet.width,
                height: selectionNet.height,
                visibility: selectionNet.visible? "visible" : "hidden",
                pointerEvents: "none"
            }}
        />

        {stickyArr.map(note => (
            <div 
                className="sticky"
                contentEditable
                key={note.id}
                onMouseDown={(e)=>dragNote(e, note)}
                onMouseMove={stickyMouseMove}
                onBlur={(e)=>stickyInput(e, note)}
                onClick={()=>updateSelectedId(note.id)}
                style={{
                    width: note.width,
                    height: note.height,
                    padding: "1em",
                    borderRadius: "0.3em",
                    backgroundColor: note.color,
                    position: "absolute",
                    zIndex: "2",
                    left: note.x,
                    top: note.y,
                    fontFamily: "Comic Sans MS",
                    cursor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.1em",
                    color: ""
                }}
            >
                {note.content}
                {selectedId===note.id && <LayerSettings stickyArr={stickyArr} setStickyArr={setStickyArr} selectedId={selectedId} /> }
            </div>
        ))}

        <div 
            className="flowing tool" 
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                width: width,
                height: width,
                borderRadius: "50%",
                backgroundColor: "transparent",
                border: "1px solid gray",
                pointerEvents: "none",
                transform: "translate(-50%, -50%)"
            }}
        />

        <canvas
            ref={canvasRef} 
            onMouseDown={onMouseDown}
            onClick={addNote}
        />
    </>
    
}