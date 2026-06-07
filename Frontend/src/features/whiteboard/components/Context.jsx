import { useParams } from "react-router-dom";

export default function Context() {
    const {teamId} = useParams(); 

    return <div className="flowing context">
        <p>Team {teamId}</p>
    </div>
}