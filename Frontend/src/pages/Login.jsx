import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import api from "../utils/axios";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({username:"", password:""});
    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const login = async(e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", form);
            localStorage.setItem("token", response.data.token);
            toast.success("Login successful");
            setTimeout(() => {
                navigate("/app")
            }, 1000);
        } catch (error) {
            console.log(error);
            toast.error("Login failed");        
        }
    }

    return <div className="login">
        <Toaster position="top-center" toastOptions={{duration: 2000}}/>

        <h1>Welcome Back!</h1>
        <form onSubmit={login}>
            <input type="text" name="username" placeholder="Enter username" required onChange={handleChange}/>
            <input type="password" name="password" placeholder="Enter password" required onChange={handleChange}/>
            <button type="submit">Login</button>
        </form>

        <p>Don't have an account? <span onClick={()=>navigate("/signup")} style={{color: "blue", textDecoration: "underline", cursor: "pointer"}}>Signup</span></p>
    </div>
}