import { useState, useEffect } from "react";
import { useEventListener } from "@liveblocks/react";

export default function useSticky({broadcast, selectedTool}) {
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


    //Listen sticky
    useEventListener(({ event }) => {
        switch (event.type) {
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

    return {stickyArr, setStickyArr, addNote, dragNote, cursor, stickyMouseMove, stickyInput, selectedId, setSelctedId, updateSelectedId};
}