import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async(e)=>{
    e.preventDefault();

    try{

      const res = await API.post("/user/login-password",{
        email,
        password
      });

      localStorage.setItem("token",res.data.token);

      navigate("/");

    }catch(err){
      alert("Login failed");
    }

  }

  return(

    <div className="login-page">

      <div className="login-card">

        <h1 className="login-title">Advika Auto Accessories</h1>
        <p className="login-sub">Staff Login</p>

        <form onSubmit={handleLogin} className="login-form">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="login-input"
          />

          <button className="login-btn">
            Login
          </button>

        </form>

      </div>

    </div>

  )

}