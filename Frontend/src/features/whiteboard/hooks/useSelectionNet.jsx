import { useState } from "react";

export default function useSelectionNet(setSelctedId) {
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

    return {selectionNet, putSelectionNet};
}