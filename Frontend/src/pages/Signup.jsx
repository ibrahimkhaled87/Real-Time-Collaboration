import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import api from "../utils/axios";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({full_name: "", username:"", password:"", confirm_password:""});
    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const signup = async(e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/signup", form);
            localStorage.setItem("token", response.data.token);
            toast.success("Signup successful");
            setTimeout(() => {
                navigate("/app")
            }, 1000);
        } catch (error) {
            toast.error(error.response?.data?.message);  
        }
    }

    return <div className="signup">
        <Toaster position="top-center" toastOptions={{duration: 2000}}/>

        <h1>Create an account</h1>
        <form onSubmit={signup}>
            <div className="entry">
                <label htmlFor="full_name">Full Name</label>
                <input type="text" name="full_name" id="full_name" placeholder="Enter full name" required onChange={handleChange}/>
            </div>
            <div className="entry">                
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" placeholder="Enter username" required onChange={handleChange}/>
            </div>
            <div className="entry">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder="Enter password" required onChange={handleChange}/>
            </div>
            <div className="entry">
                <label htmlFor="confirm_password">Confirm Password</label>
                <input type="password" name="confirm_password" id="confirm_password" placeholder="Confirm password" required onChange={handleChange}/>
            </div>
            <button type="submit">Signup</button>
        </form>

        <p>Already a member? <span onClick={()=>navigate("")} style={{color: "blue", textDecoration: "underline", cursor: "pointer"}}>Login</span></p>
    </div>
}