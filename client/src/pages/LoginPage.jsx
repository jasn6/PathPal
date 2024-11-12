import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../util/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });
      if (response.ok) {
        const res = await response.json();
        setLoggedIn(true);
        alert(res.message);
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (err) {
      console.log(err);
    } finally {
      navigate("/");
    }
  }

  return (
    <div className="LoginPage-background">
      <div className="LoginPage-container">
        <div className="LoginPage-avatar">
          <FaUserCircle className="LoginPage-icon" />
        </div>
        <h1 className="LoginPage-title">Sign in</h1>
        <form onSubmit={handleSubmit} className="LoginPage-form">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            required
            autoComplete="email"
            autoFocus
            className="LoginPage-input"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            autoComplete="current-password"
            className="LoginPage-input"
          />
          <button type="submit" className="LoginPage-submitButton">
            Sign In
          </button>
          <div className="LoginPage-links">
            <a href="#" className="LoginPage-link">
              Forgot password?
            </a>
            <div className="LoginPage-Gap"></div>
            <a href="/register" className="LoginPage-link">
              Don't have an account?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
