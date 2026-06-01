import { SquareArrowRightExit } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTokenDecode from "../hooks/useTokenDecode";

export default function User() {
    const payload = useTokenDecode();

    //Dropdown
    const [show, setShow] = useState(false);

    // Logout
    const navigate = useNavigate();
    const logout = async() => {
        localStorage.removeItem("token");
        navigate("/")
    }

    return <div className="user">
        <div className="box" onClick={()=> setShow(!show)}>
            {payload?.username?.charAt(0)?.toUpperCase()}
        </div>
        <div className={`user-dropdown ${show? "show" : ""}`}>
            <div className="logout" onClick={logout}>
                <SquareArrowRightExit />
                Logout
            </div>
        </div>
    </div>
}