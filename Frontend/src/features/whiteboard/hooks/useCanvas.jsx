import { useState, useEffect, useRef } from "react";
import { useEventListener } from "@liveblocks/react";

export default function useCanvas({broadcast, selectedTool}) {
    // Canvas setup
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

    
    // Canvas Draw
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

    //Listen draw
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

        }
    });


    return {canvasRef, width, draw};
}