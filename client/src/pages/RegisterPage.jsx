import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        password: data.get("password"),
      }),
    });

    const res = await response.json();

    if (res.status === "ok") {
      navigate("/login");
    }
  }

  return (
    <div className="RegisterPage-background">
      <div className="RegisterPage-container">
        <div className="RegisterPage-avatar">
          <FaUserCircle className="RegisterPage-icon" />
        </div>
        <h1 className="RegisterPage-title">Sign up</h1>
        <form onSubmit={handleSubmit} className="RegisterPage-form">
          <div className="RegisterPage-grid">
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              required
              autoComplete="given-name"
              className="RegisterPage-input half-width"
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              required
              autoComplete="family-name"
              className="RegisterPage-input half-width"
            />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            required
            autoComplete="email"
            className="RegisterPage-input"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            autoComplete="new-password"
            className="RegisterPage-input"
          />
          <button type="submit" className="RegisterPage-submitButton">
            Sign Up
          </button>
          <div className="RegisterPage-links">
            <a href="/login" className="RegisterPage-link">
              Already have an account?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
