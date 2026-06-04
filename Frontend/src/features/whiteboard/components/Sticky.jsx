import LayerSettings from "../../../components/LayerSettings";
import useSticky from "../hooks/useSticky";

export default function Sticky({broadcast, selectedTool, stickyArr, setStickyArr, dragNote, stickyMouseMove, stickyInput, updateSelectedId, selectedId, cursor}) {
    return <>
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
                    fontSize: "1.1em"
                }}
            >
                {note.content}
                {selectedId===note.id && <LayerSettings stickyArr={stickyArr} setStickyArr={setStickyArr} selectedId={selectedId} /> }
            </div>
        ))}
    </>
}